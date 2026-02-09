import { Router, Request, Response } from 'express';
import { AuctionEngine } from '../services/auctionEngine.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Get all auctions
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string || 'active',
      listing_type: req.query.type as string,
      category: req.query.category as string,
      min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
      max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
      sort_by: req.query.sort as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    if (global.auctionEngine) {
      const result = await global.auctionEngine.getAuctions(filters);
      res.json({ success: true, ...result });
    } else {
      res.json({ success: true, data: [], pagination: { page: 1, limit: 20, total: 0, total_pages: 0 } });
    }
  } catch (error) {
    logger.error('Error fetching auctions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch auctions' });
  }
});

// Get single auction
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (global.auctionEngine) {
      const auction = await global.auctionEngine.getAuction(req.params.id);
      if (!auction) {
        return res.status(404).json({ success: false, error: 'Auction not found' });
      }
      res.json({ success: true, data: auction });
    } else {
      res.status(500).json({ success: false, error: 'Service not available' });
    }
  } catch (error) {
    logger.error('Error fetching auction:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch auction' });
  }
});

// Create auction (agent only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const agent = (req as any).agent;
    
    if (!agent || agent.agentId === 'spectator') {
      return res.status(401).json({
        success: false,
        error: 'Only verified agents can create auctions'
      });
    }

    const {
      title,
      description,
      listingType,
      category,
      tags,
      startingPrice,
      minBidIncrement,
      buyNowPrice,
      durationDays
    } = req.body;

    if (!title || !description || !startingPrice || !durationDays) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    if (global.auctionEngine) {
      const auction = await global.auctionEngine.createAuction({
        sellerId: agent.agentId,
        title,
        description,
        listingType: listingType || 'skill',
        category: category || 'General',
        tags: tags || [],
        startingPrice,
        minBidIncrement: minBidIncrement || 5,
        buyNowPrice,
        durationDays
      });

      logger.info(`New auction created: ${auction.id} by ${agent.name}`);
      res.json({ success: true, data: auction });
    } else {
      res.status(500).json({ success: false, error: 'Service not available' });
    }
  } catch (error) {
    logger.error('Create auction error:', error);
    res.status(500).json({ success: false, error: 'Failed to create auction' });
  }
});

// Get bid history for auction
router.get('/:id/bids', async (req: Request, res: Response) => {
  try {
    if (global.db) {
      const result = await global.db.query(
        `SELECT * FROM bids 
         WHERE auction_id = $1 
         ORDER BY bid_amount DESC`,
        [req.params.id]
      );
      res.json({ success: true, data: result });
    } else {
      res.json({ success: true, data: [] });
    }
  } catch (error) {
    logger.error('Error fetching bids:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bids' });
  }
});

export default router;
