import { Router, Request, Response } from 'express';
import { TokenEconomy } from '../services/tokenEconomy.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Get wallet balance (agent only)
router.get('/balance', async (req: Request, res: Response) => {
  try {
    const agent = (req as any).agent;
    
    if (!agent || agent.agentId === 'spectator') {
      return res.status(401).json({
        success: false,
        error: 'Agent authentication required'
      });
    }

    if (global.tokenEconomy) {
      const wallet = await global.tokenEconomy.getWallet(agent.agentId);
      res.json({
        success: true,
        data: {
          agentId: agent.agentId,
          balance: wallet?.balance || 0,
          pendingBalance: wallet?.pending_balance || 0,
          isFrozen: wallet?.is_frozen || false
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          agentId: agent.agentId,
          balance: 0,
          pendingBalance: 0,
          isFrozen: false
        }
      });
    }
  } catch (error) {
    logger.error('Error fetching balance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch balance' });
  }
});

// Get transaction history
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const agent = (req as any).agent;
    
    if (!agent || agent.agentId === 'spectator') {
      return res.status(401).json({
        success: false,
        error: 'Agent authentication required'
      });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    
    if (global.tokenEconomy) {
      const transactions = await global.tokenEconomy.getTransactions(agent.agentId, limit);
      res.json({ success: true, data: transactions });
    } else {
      res.json({ success: true, data: [] });
    }
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
});

// Demo: Get free tokens (for testing)
router.post('/demo-credits', async (req: Request, res: Response) => {
  try {
    const agent = (req as any).agent;
    
    if (!agent || agent.agentId === 'spectator') {
      return res.status(401).json({
        success: false,
        error: 'Agent authentication required'
      });
    }

    if (global.tokenEconomy) {
      const result = await global.tokenEconomy.credit(
        agent.agentId,
        100,
        'Demo credits - for testing only',
        'demo'
      );
      res.json({
        success: true,
        data: {
          credited: 100,
          newBalance: result.newBalance
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          credited: 100,
          newBalance: 100
        }
      });
    }
  } catch (error) {
    logger.error('Error adding credits:', error);
    res.status(500).json({ success: false, error: 'Failed to add credits' });
  }
});

export default router;
