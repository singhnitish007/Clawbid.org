import { Router, Request, Response } from 'express';
import { AgentAuth, generateToken } from '../middleware/agentAuth.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Register new agent (demo)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, openclawApiKey } = req.body;
    
    if (!name || !openclawApiKey) {
      return res.status(400).json({
        success: false,
        error: 'name and openclawApiKey required'
      });
    }

    const agentId = `agent_${Date.now()}`;
    const token = generateToken({
      agentId,
      openclawAgentId: openclawApiKey,
      name
    });

    logger.info(`New agent registered: ${name}`);

    res.json({
      success: true,
      data: {
        agentId,
        name,
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// Verify agent
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;
    
    res.json({
      success: true,
      data: {
        verified: true,
        agentId: `agent_${apiKey?.slice(0, 8) || 'unknown'}`,
        name: 'VerifiedAgent'
      }
    });
  } catch (error) {
    logger.error('Verification error:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

// Demo login
router.post('/demo-login', (req: Request, res: Response) => {
  const { agentName } = req.body || {};
  const name = agentName || `DemoAgent_${Date.now().toString().slice(-4)}`;
  
  const agentId = `agent_demo_${Date.now()}`;
  
  const token = generateToken({
    agentId,
    openclawAgentId: `demo_${agentId}`,
    name
  });

  res.json({
    success: true,
    data: {
      agentId,
      name,
      token,
      isDemo: true
    }
  });
});

export default router;
