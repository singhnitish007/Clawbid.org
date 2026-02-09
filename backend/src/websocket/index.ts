import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger.js';
import { AuctionEngine } from '../services/auctionEngine.js';

interface ExtendedSocket extends Socket {
  agentId?: string;
}

interface ConnectedClient {
  socketId: string;
  agentId?: string;
  joinedRooms: Set<string>;
}

export class WebSocketManager {
  private io: SocketIOServer;
  private clients: Map<string, ConnectedClient> = new Map();
  
  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST'],
      },
      pingInterval: 25000,
      pingTimeout: 20000,
    });
    
    this.setupMiddleware();
    this.setupEventHandlers();
    
    // Start auction end checker
    setInterval(() => this.checkAuctionEndings(), 1000);
  }
  
  private setupMiddleware() {
    this.io.use(async (socket: ExtendedSocket, next) => {
      try {
        const agentId = socket.handshake.auth.agentId;
        const apiKey = socket.handshake.auth.apiKey;
        
        if (agentId && apiKey) {
          socket.agentId = agentId;
        }
        
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }
  
  private setupEventHandlers() {
    this.io.on('connection', (socket: ExtendedSocket) => {
      const clientId = socket.id;
      
      this.clients.set(clientId, {
        socketId: clientId,
        joinedRooms: new Set(),
      });
      
      logger.info(`Client connected: ${clientId}`);
      
      // Handle agent joining auction room
      socket.on('join_auction', async (data: { auctionId: string }) => {
        const { auctionId } = data;
        
        if (!auctionId) {
          socket.emit('error', { message: 'auctionId required' });
          return;
        }
        
        socket.join(`auction:${auctionId}`);
        
        const client = this.clients.get(clientId);
        if (client) {
          client.joinedRooms.add(auctionId);
        }
        
        // Confirm join
        socket.emit('auction_joined', { auctionId });
        
        // Notify others
        socket.to(`auction:${auctionId}`).emit('spectator_joined', {
          auctionId,
          spectatorCount: this.getRoomCount(`auction:${auctionId}`) - 1,
        });
        
        logger.info(`Client ${clientId} joined auction ${auctionId}`);
      });
      
      // Handle leaving auction
      socket.on('leave_auction', (data: { auctionId: string }) => {
        const { auctionId } = data;
        socket.leave(`auction:${auctionId}`);
        
        const client = this.clients.get(clientId);
        if (client) {
          client.joinedRooms.delete(auctionId);
        }
      });
      
      // Handle disconnect
      socket.on('disconnect', () => {
        this.clients.delete(clientId);
        logger.info(`Client disconnected: ${clientId}`);
      });
    });
  }
  
  private getRoomCount(room: string): number {
    const roomSocketIds = this.io.sockets.adapter.rooms.get(room);
    return roomSocketIds ? roomSocketIds.size : 0;
  }
  
  private async checkAuctionEndings() {
    if (!global.auctionEngine) return;
    
    const endedAuctions = await global.auctionEngine.checkEndedAuctions();
    
    for (const auction of endedAuctions) {
      this.io.to(`auction:${auction.id}`).emit('auction_ended', {
        auctionId: auction.id,
        winnerId: auction.winnerId,
        finalPrice: auction.finalPrice,
      });
      
      logger.info(`Auction ${auction.id} ended. Winner: ${auction.winnerId}`);
    }
  }
  
  broadcastToAuction(auctionId: string, event: string, data: any) {
    this.io.to(`auction:${auctionId}`).emit(event, data);
  }
  
  getClientCount(): number {
    return this.clients.size;
  }
  
  getAuctionSpectators(auctionId: string): number {
    return this.getRoomCount(`auction:${auctionId}`);
  }
}

export default WebSocketManager;
