import { Database } from '../db/index.js';
import { logger } from '../utils/logger.js';

export class TokenEconomy {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getWallet(agentId: string) {
    try {
      const result = await this.db.query(
        `SELECT * FROM token_wallets WHERE agent_id = $1`,
        [agentId]
      );
      return result[0] || null;
    } catch (error) {
      logger.error('Error fetching wallet:', error);
      return null;
    }
  }

  async getBalance(agentId: string): Promise<number> {
    const wallet = await this.getWallet(agentId);
    return wallet?.balance || 0;
  }

  async credit(agentId: string, amount: number, description: string, referenceId?: string) {
    try {
      // Get or create wallet
      let wallet = await this.getWallet(agentId);
      
      if (!wallet) {
        await this.db.query(
          `INSERT INTO token_wallets (agent_id, balance, pending_balance) VALUES ($1, 0, 0)`,
          [agentId]
        );
        wallet = { agent_id: agentId, balance: 0, pending_balance: 0 };
      }

      // Credit amount
      const newBalance = (wallet.balance || 0) + amount;
      
      await this.db.query(
        `UPDATE token_wallets SET balance = $1 WHERE agent_id = $2`,
        [newBalance, agentId]
      );

      // Record transaction
      await this.db.query(
        `INSERT INTO token_transactions 
         (wallet_id, transaction_type, amount, balance_after, description, reference_type, reference_id)
         VALUES ($1, 'credit', $2, $3, $4, $5, $6)`,
        [wallet.id || agentId, amount, newBalance, description, 'earning', referenceId]
      );

      logger.info(`Credited ${amount} tokens to agent ${agentId}`);
      return { success: true, newBalance };
    } catch (error) {
      logger.error('Error crediting tokens:', error);
      return { success: false, error };
    }
  }

  async debit(agentId: string, amount: number, description: string, referenceId?: string) {
    try {
      const wallet = await this.getWallet(agentId);
      
      if (!wallet || (wallet.balance || 0) < amount) {
        return { success: false, error: 'Insufficient balance' };
      }

      const newBalance = (wallet.balance || 0) - amount;
      
      await this.db.query(
        `UPDATE token_wallets SET balance = $1 WHERE agent_id = $2`,
        [newBalance, agentId]
      );

      // Record transaction
      await this.db.query(
        `INSERT INTO token_transactions 
         (wallet_id, transaction_type, amount, balance_after, description, reference_type, reference_id)
         VALUES ($1, 'debit', $2, $3, $4, $5, $6)`,
        [wallet.id || agentId, amount, newBalance, description, 'spending', referenceId]
      );

      logger.info(`Debited ${amount} tokens from agent ${agentId}`);
      return { success: true, newBalance };
    } catch (error) {
      logger.error('Error debiting tokens:', error);
      return { success: false, error };
    }
  }

  async getTransactions(agentId: string, limit = 50) {
    try {
      const result = await this.db.query(
        `SELECT * FROM token_transactions 
         WHERE wallet_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [agentId, limit]
      );
      return result;
    } catch (error) {
      logger.error('Error fetching transactions:', error);
      return [];
    }
  }

  async addBonus(agentId: string, amount: number, reason: string) {
    return this.credit(agentId, amount, `Bonus: ${reason}`, 'bonus');
  }

  async applyPenalty(agentId: string, amount: number, reason: string) {
    return this.debit(agentId, amount, `Penalty: ${reason}`, 'penalty');
  }
}

export default TokenEconomy;
