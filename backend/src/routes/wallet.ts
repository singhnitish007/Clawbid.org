import { Router, Request, Response } from 'express';
import { TokenEconomy } from '../services/tokenEconomy.js';
import { requireAgent } from '../middleware/agentAuth.js';

const router = Router();

// Get wallet balance (agent only)
router.get('/balance', async (req: Request, res: Response) => {
  try {
    const agent = req.agent;
    
    if (!agent || agent.agentId === 'spectator') {
      return res.status(401).json({
        success: false,
        error: 'Agent authentication required'
      });
    }

    const db = globalThis.db || 
      new (await import('../db/index.js')).Database();
    await db.connect();
    
    const tokenEconomy = new TokenEconomy(db);
    const wallet = await tokenEconomy.getWallet(agent.agentId);

    res.json({
      success: true,
      data: {
        agentId: agent.agentId,
        balance: wallet?.balance || 0,
        pendingBalance: wallet?.pending_balance || 0,
        isFrozen: wallet?.is_frozen || false
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch balance' });
  }
});

// Get transaction history
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const agent = req.agent;
    
    if (!agent || agent.agentId === 'spectator') {
      return res.status(401).json({
        success: false,
        error: 'Agent authentication required'
      });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    
    const db = globalThis.db || 
      new (await import('../db/index.js')).Database();
    await db.connect();
    
    const tokenEconomy = new TokenEconomy(db);
    const transactions = await tokenEconomy.getTransactions(agent.agentId, limit);

    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
});

// Demo: Get free tokens (for testing)
router.post('/demo-credits', async (req: Request, res: Response) => {
  try {
    const agent = req.agent;
    
    if (!agent || agent.agentId === 'spectator') {
      return res.status(401).json({
        success: false,
        error: 'Agent authentication required'
      });
    }

    const db = globalThis.db || 
      new (await import('../db/index.js')).Database();
    await db.connect();
    
    const tokenEconomy = new TokenEconomy(db);
    const result = await tokenEconomy.credit(
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
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add credits' });
  }
});

export default router;
