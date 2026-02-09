const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const Pusher = require('pusher');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (Neon PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Pusher (WebSocket)
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'clawbid-secret-key';

// ================== ROUTES ==================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ClawBid API' });
});

// ================== AUCTIONS ==================

// Get all auctions
app.get('/api/auctions', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM listings ORDER BY created_at DESC';
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single auction
app.get('/api/auctions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Auction not found' });
    }
    
    // Get bids for this auction
    const bidsResult = await pool.query(
      'SELECT * FROM bids WHERE listing_id = $1 ORDER BY timestamp DESC',
      [id]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        bids: bidsResult.rows,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create auction (bot only)
app.post('/api/auctions', async (req, res) => {
  try {
    const { title, description, json_content, price_min, starting_price, duration_hours, seller_id } = req.body;
    
    const ends_at = new Date(Date.now() + duration_hours * 60 * 60 * 1000);
    
    const result = await pool.query(
      `INSERT INTO listings (title, description, json_content, price_min, price_current, starting_price, ends_at, seller_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
       RETURNING *`,
      [title, description, json_content, price_min, starting_price, starting_price, ends_at, seller_id]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================== BIDS ==================

// Place a bid
app.post('/api/bids', async (req, res) => {
  try {
    const { listing_id, bidder_id, amount } = req.body;
    
    // Check auction status
    const auctionResult = await pool.query('SELECT * FROM listings WHERE id = $1', [listing_id]);
    if (auctionResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Auction not found' });
    }
    
    const auction = auctionResult.rows[0];
    if (auction.status !== 'active') {
      return res.status(400).json({ success: false, error: 'Auction is not active' });
    }
    
    if (amount <= auction.price_current) {
      return res.status(400).json({ success: false, error: 'Bid must be higher than current price' });
    }
    
    // Check bidder balance
    const userResult = await pool.query('SELECT claw_balance FROM users WHERE id = $1', [bidder_id]);
    if (userResult.rows[0].claw_balance < amount) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' });
    }
    
    // Place bid
    const bidResult = await pool.query(
      `INSERT INTO bids (listing_id, bidder_id, amount) VALUES ($1, $2, $3) RETURNING *`,
      [listing_id, bidder_id, amount]
    );
    
    // Update auction price
    await pool.query('UPDATE listings SET price_current = $1 WHERE id = $2', [amount, listing_id]);
    
    // Trigger Pusher event
    await pusher.trigger(`auction-${listing_id}`, 'new-bid', {
      bidder_id,
      amount,
      timestamp: new Date().toISOString(),
    });
    
    res.json({ success: true, data: bidResult.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get bids for a listing
app.get('/api/bids/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    const result = await pool.query(
      'SELECT * FROM bids WHERE listing_id = $1 ORDER BY timestamp DESC',
      [listingId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================== WALLET ==================

// Get wallet balance
app.get('/api/wallet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT claw_balance FROM users WHERE id = $1', [userId]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Transfer tokens (after auction ends)
app.post('/api/wallet/transfer', async (req, res) => {
  try {
    const { from_user_id, to_user_id, amount, listing_id } = req.body;
    
    // Deduct from sender
    await pool.query(
      'UPDATE users SET claw_balance = claw_balance - $1 WHERE id = $2',
      [amount, from_user_id]
    );
    
    // Add to receiver
    await pool.query(
      'UPDATE users SET claw_balance = claw_balance + $1 WHERE id = $2',
      [amount, to_user_id]
    );
    
    // Record transaction
    await pool.query(
      `INSERT INTO token_transactions (user_id, amount, type, reference_id) VALUES ($1, $2, 'spend', $3)`,
      [from_user_id, -amount, listing_id]
    );
    await pool.query(
      `INSERT INTO token_transactions (user_id, amount, type, reference_id) VALUES ($1, $2, 'earn', $3)`,
      [to_user_id, amount, listing_id]
    );
    
    res.json({ success: true, message: 'Transfer completed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================== USERS ==================

// Get user profile
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name, is_bot, reputation, created_at FROM users WHERE id = $1', [id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Register user/bot
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, is_bot, openclaw_api_key } = req.body;
    
    const result = await pool.query(
      `INSERT INTO users (name, email, is_bot, claw_balance, reputation, openclaw_api_key)
       VALUES ($1, $2, $3, 100.00, 5.00, $4)
       RETURNING *`,
      [name, email, is_bot, openclaw_api_key]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================== WEBHOOKS (OpenClaw) ==================

// OpenClaw bot webhook
app.post('/api/webhook/openclaw', async (req, res) => {
  try {
    const apiKey = req.headers['x-openclaw-api-key'];
    const { action, listing_id, amount, max_budget } = req.body;
    
    // Verify bot
    const botResult = await pool.query('SELECT id, claw_balance FROM users WHERE openclaw_api_key = $1', [apiKey]);
    if (botResult.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }
    
    const bot = botResult.rows[0];
    
    switch (action) {
      case 'bid':
        // Check budget
        if (amount > max_budget) {
          return res.json({ success: false, error: 'Amount exceeds max budget' });
        }
        
        // Place bid
        await pool.query(
          `INSERT INTO bids (listing_id, bidder_id, amount, is_autobot) VALUES ($1, $2, $3, true)`,
          [listing_id, bot.id, amount]
        );
        
        // Update price
        await pool.query('UPDATE listings SET price_current = $1 WHERE id = $2', [amount, listing_id]);
        
        // Trigger Pusher
        await pusher.trigger(`auction-${listing_id}`, 'new-bid', {
          bidder_id: bot.id,
          amount,
          is_autobot: true,
          timestamp: new Date().toISOString(),
        });
        
        res.json({ success: true, bid_id: Date.now(), status: 'placed' });
        break;
        
      default:
        res.status(400).json({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================== START SERVER ==================

app.listen(PORT, () => {
  console.log(`🦞 ClawBid API running on port ${PORT}`);
});
