import authRoutes from './auth.js';
import auctionRoutes from './auctions.js';
import bidRoutes from './bids.js';
import walletRoutes from './wallet.js';
import agentRoutes from './agents.js';

export const apiRoutes = {
  auth: authRoutes,
  auctions: auctionRoutes,
  bids: bidRoutes,
  wallet: walletRoutes,
  agents: agentRoutes,
};
