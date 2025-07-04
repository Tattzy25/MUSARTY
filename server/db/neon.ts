import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name?: string;
  tier: "free" | "pro" | "byok";
  generations_used: number;
  created_at: Date;
  updated_at: Date;
}

export interface Generation {
  id: string;
  user_id: string;
  model: string;
  prompt: string;
  result: string;
  cost: number;
  created_at: Date;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  paypal_payment_id: string;
  created_at: Date;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}

export class Database {
  static async init() {
    // Create users table with proper auth fields
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        tier VARCHAR(20) DEFAULT 'free',
        generations_used INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create generations table
    await sql`
      CREATE TABLE IF NOT EXISTS generations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        model VARCHAR(100) NOT NULL,
        prompt TEXT NOT NULL,
        result TEXT,
        cost DECIMAL(10,4) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create payments table
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'pending',
        paypal_payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create password reset tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create API keys table for user BYOK
    await sql`
      CREATE TABLE IF NOT EXISTS user_api_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        provider VARCHAR(50) NOT NULL,
        encrypted_key TEXT NOT NULL,
        key_name VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create usage tracking table
    await sql`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        model_id VARCHAR(100) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        chars_used INTEGER DEFAULT 0,
        blocks_deducted INTEGER DEFAULT 0,
        byok_used BOOLEAN DEFAULT FALSE,
        content_type VARCHAR(20) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id)`;
  }

  static async createUser(
    email: string,
    password_hash: string,
    name?: string,
  ): Promise<User> {
    const [user] = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${password_hash}, ${name})
      RETURNING *
    `;
    return user as User;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return (user as User) || null;
  }

  static async getUserById(id: string): Promise<User | null> {
    const [user] = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    return (user as User) || null;
  }

  static async updateUserTier(userId: string, tier: string): Promise<void> {
    await sql`
      UPDATE users 
      SET tier = ${tier}, updated_at = NOW()
      WHERE id = ${userId}
    `;
  }

  static async updateUserPassword(
    userId: string,
    password_hash: string,
  ): Promise<void> {
    await sql`
      UPDATE users 
      SET password_hash = ${password_hash}, updated_at = NOW()
      WHERE id = ${userId}
    `;
  }

  static async incrementGenerations(userId: string): Promise<void> {
    await sql`
      UPDATE users 
      SET generations_used = generations_used + 1, updated_at = NOW()
      WHERE id = ${userId}
    `;
  }

  static async logGeneration(
    userId: string,
    model: string,
    prompt: string,
    result: string,
    cost: number = 0,
  ): Promise<void> {
    await sql`
      INSERT INTO generations (user_id, model, prompt, result, cost)
      VALUES (${userId}, ${model}, ${prompt}, ${result}, ${cost})
    `;
  }

  static async logUsage(
    userId: string,
    modelId: string,
    provider: string,
    charsUsed: number,
    blocksDeducted: number,
    byokUsed: boolean,
    contentType: string = "text",
  ): Promise<void> {
    await sql`
      INSERT INTO usage_logs (user_id, model_id, provider, chars_used, blocks_deducted, byok_used, content_type)
      VALUES (${userId}, ${modelId}, ${provider}, ${charsUsed}, ${blocksDeducted}, ${byokUsed}, ${contentType})
    `;
  }

  static async getUserUsageStats(userId: string): Promise<any> {
    const [stats] = await sql`
      SELECT 
        COUNT(*) as total_requests,
        SUM(chars_used) as total_chars,
        SUM(blocks_deducted) as total_blocks_used,
        COUNT(CASE WHEN byok_used = true THEN 1 END) as byok_requests,
        COUNT(CASE WHEN byok_used = false THEN 1 END) as vault_requests
      FROM usage_logs 
      WHERE user_id = ${userId}
    `;

    const modelsUsed = await sql`
      SELECT DISTINCT model_id FROM usage_logs WHERE user_id = ${userId}
    `;

    return {
      ...stats,
      models_used: modelsUsed.map((m) => m.model_id),
    };
  }

  static async createPayment(
    userId: string,
    amount: number,
    paypalPaymentId: string,
  ): Promise<Payment> {
    const [payment] = await sql`
      INSERT INTO payments (user_id, amount, paypal_payment_id)
      VALUES (${userId}, ${amount}, ${paypalPaymentId})
      RETURNING *
    `;
    return payment as Payment;
  }

  static async updatePaymentStatus(
    paypalPaymentId: string,
    status: string,
  ): Promise<void> {
    await sql`
      UPDATE payments 
      SET status = ${status}
      WHERE paypal_payment_id = ${paypalPaymentId}
    `;
  }

  // Password reset functionality
  static async storePasswordResetToken(
    userId: string,
    token: string,
  ): Promise<void> {
    // Invalidate any existing tokens first
    await sql`
      UPDATE password_reset_tokens 
      SET used = TRUE 
      WHERE user_id = ${userId} AND used = FALSE
    `;

    // Create new token (expires in 1 hour)
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${userId}, ${token}, NOW() + INTERVAL '1 hour')
    `;
  }

  static async verifyPasswordResetToken(
    userId: string,
    token: string,
  ): Promise<boolean> {
    const [tokenRow] = await sql`
      SELECT * FROM password_reset_tokens 
      WHERE user_id = ${userId} 
        AND token = ${token} 
        AND used = FALSE 
        AND expires_at > NOW()
    `;
    return !!tokenRow;
  }

  static async invalidatePasswordResetToken(userId: string): Promise<void> {
    await sql`
      UPDATE password_reset_tokens 
      SET used = TRUE 
      WHERE user_id = ${userId} AND used = FALSE
    `;
  }

  // User API Keys management
  static async storeUserApiKey(
    userId: string,
    provider: string,
    encryptedKey: string,
    keyName?: string,
  ): Promise<void> {
    await sql`
      INSERT INTO user_api_keys (user_id, provider, encrypted_key, key_name)
      VALUES (${userId}, ${provider}, ${encryptedKey}, ${keyName})
    `;
  }

  static async getUserApiKeys(userId: string): Promise<any[]> {
    return await sql`
      SELECT provider, key_name, is_active, created_at
      FROM user_api_keys 
      WHERE user_id = ${userId} AND is_active = TRUE
    `;
  }

  static async getUserApiKey(
    userId: string,
    provider: string,
  ): Promise<string | null> {
    const [key] = await sql`
      SELECT encrypted_key 
      FROM user_api_keys 
      WHERE user_id = ${userId} AND provider = ${provider} AND is_active = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return key?.encrypted_key || null;
  }

  static async deleteUserApiKey(
    userId: string,
    provider: string,
  ): Promise<void> {
    await sql`
      UPDATE user_api_keys 
      SET is_active = FALSE, updated_at = NOW()
      WHERE user_id = ${userId} AND provider = ${provider}
    `;
  }
}
