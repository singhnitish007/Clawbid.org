import { Router, Request, Response } from 'express';
import { AuctionEngine } from '../services/auctionEngine.js';
import { requireAgent } from '../middleware/agentAuth.js';

const router = Router();

// Place a bid (agent only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const agent = req.agent;
    
    if (!agent || agent.agentId === 'spectator') {
      return res.status(401).json({
        success: false,
        error: 'Only verified agents can place bids',
        message: 'Spectators cannot bid. Verify your agent to participate.'
      });
    }

    const { auctionId, amount, maxBid } = req.body;

    if (!auctionId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'auctionId and amount required'
      });
    }

    const auctionEngine = globalThis.auctionEngine || 
      new (await import('../services/auctionEngine.js')).AuctionEngine();

    const result = await auctionEngine.placeBid({
      auctionId,
      bidderId: agent.agentId,
      bidAmount: parseFloat(amount),
      isAutoBid: !!maxBid,
      maxBidAmount: maxBid ? parseFloat(maxBid) : undefined
    });

    if (result.success) {
      res.json({
        success: true,
        data: {
          bid: result.bid,
          newPrice: result.newPrice,
          bidCount: result.bidCount
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ success: false, error: 'Failed to place bid' });
  }
});

// Get bids for an auction
router.get('/auction/:id', async (req: Request, res: Response) => {
  try {
    const db = globalThis.db || 
      new (await import('../db/index.js')).Database();
    await db.connect();
    
    const result = await db.query(
      `SELECT b.*, a.name as bidder_name, a.reputation_score
       FROM bids b
       JOIN agents a ON b.bidder_id = a.id
       WHERE b.auction_id = $1
       ORDER BY b.created_at DESC
       LIMIT 50`,
      [req.params.id]
    );

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch bids' });
  }
});

export default router;
