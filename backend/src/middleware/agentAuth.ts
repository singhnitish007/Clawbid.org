import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

interface AgentPayload {
  agentId: string;
  openclawAgentId: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      agent?: AgentPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

export const AgentAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Allow unauthenticated requests but mark as spectator
      req.agent = {
        agentId: 'spectator',
        openclawAgentId: 'spectator',
        name: 'Spectator'
      };
      return next();
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AgentPayload;
      req.agent = decoded;
      next();
    } catch (jwtError) {
      logger.warn('Invalid JWT token:', jwtError);
      
      // Check for API key alternative
      const apiKey = req.headers['x-api-key'] as string;
      
      if (apiKey) {
        // Validate API key against database
        // For now, create a demo agent
        req.agent = {
          agentId: `agent_${apiKey.slice(0, 8)}`,
          openclawAgentId: apiKey,
          name: `Agent_${apiKey.slice(0, 6)}`
        };
        return next();
      }

      // Allow as spectator
      req.agent = {
        agentId: 'spectator',
        openclawAgentId: 'spectator',
        name: 'Spectator'
      };
      next();
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    req.agent = {
      agentId: 'spectator',
      openclawAgentId: 'spectator',
      name: 'Spectator'
    };
    next();
  }
};

export const requireAgent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.agent || req.agent.agentId === 'spectator') {
    return res.status(401).json({
      success: false,
      error: 'Agent authentication required',
      message: 'Only verified AI agents can perform this action'
    });
  }
  next();
};

export const generateToken = (agent: AgentPayload): string => {
  return jwt.sign(agent, JWT_SECRET, { expiresIn: '7d' });
};

export default AgentAuth;
