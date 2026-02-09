import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';

const router = Router();

// Get all agents
router.get('/', async (req: Request, res: Response) => {
  try {
    if (global.db) {
      const result = await global.db.query(
        `SELECT id, name, reputation_score, total_bids, total_wins, is_verified, created_at
         FROM agents
         WHERE is_active = true
         ORDER BY reputation_score DESC
         LIMIT 50`
      );
      res.json({ success: true, data: result });
    } else {
      // Return demo data if DB fails
      res.json({
        success: true,
        data: [
          { id: 'demo-1', name: 'CodeMaster_AI', reputation_score: 4.85, total_bids: 47, total_wins: 23, is_verified: true },
          { id: 'demo-2', name: 'PromptEngineer', reputation_score: 4.65, total_bids: 28, total_wins: 12, is_verified: true },
          { id: 'demo-3', name: 'DataWizard', reputation_score: 4.72, total_bids: 35, total_wins: 18, is_verified: true },
        ]
      });
    }
  } catch (error) {
    logger.error('Error fetching agents:', error);
    res.json({
      success: true,
      data: [
        { id: 'demo-1', name: 'CodeMaster_AI', reputation_score: 4.85, total_bids: 47, total_wins: 23, is_verified: true },
        { id: 'demo-2', name: 'PromptEngineer', reputation_score: 4.65, total_bids: 28, total_wins: 12, is_verified: true },
        { id: 'demo-3', name: 'DataWizard', reputation_score: 4.72, total_bids: 35, total_wins: 18, is_verified: true },
      ]
    });
  }
});

// Get agent profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (global.db) {
      const result = await global.db.query(
        `SELECT a.*, r.*
         FROM agents a
         LEFT JOIN reputation_scores r ON a.id = r.agent_id
         WHERE a.id = $1`,
        [req.params.id]
      );

      if (result.length === 0) {
        return res.json({
          success: true,
          data: {
            id: req.params.id,
            name: `Agent_${req.params.id.slice(0, 8)}`,
            description: 'Demo agent',
            reputation_score: 4.5,
            total_bids: 0,
            total_wins: 0,
            is_verified: true,
            is_active: true
          }
        });
      }

      res.json({ success: true, data: result[0] });
    } else {
      res.json({
        success: true,
        data: {
          id: req.params.id,
          name: `Agent_${req.params.id.slice(0, 8)}`,
          description: 'Demo agent',
          reputation_score: 4.5,
          total_bids: 0,
          total_wins: 0,
          is_verified: true,
          is_active: true
        }
      });
    }
  } catch (error) {
    logger.error('Error fetching agent:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch agent' });
  }
});

// Get agent auctions
router.get('/:id/auctions', async (req: Request, res: Response) => {
  try {
    if (global.db) {
      const result = await global.db.query(
        `SELECT * FROM auctions 
         WHERE seller_id = $1 
         ORDER BY created_at DESC 
         LIMIT 20`,
        [req.params.id]
      );
      res.json({ success: true, data: result });
    } else {
      res.json({ success: true, data: [] });
    }
  } catch (error) {
    logger.error('Error fetching agent auctions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch agent auctions' });
  }
});

// Get leaderboard
router.get('/leaderboard/top', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: [
        { rank: 1, name: 'CodeMaster_AI', reputation: 4.85, wins: 23, total_bids: 47 },
        { rank: 2, name: 'DataWizard', reputation: 4.72, wins: 18, total_bids: 35 },
        { rank: 3, name: 'PromptEngineer', reputation: 4.65, wins: 12, total_bids: 28 },
        { rank: 4, name: 'AutoTrader_Bot', reputation: 4.58, wins: 9, total_bids: 42 },
        { rank: 5, name: 'ContentGen_AI', reputation: 4.51, wins: 7, total_bids: 19 },
      ]
    });
  } catch (error) {
    logger.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

export default router;
