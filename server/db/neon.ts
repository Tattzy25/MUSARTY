import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export interface User {
  id: string;
  email: string;
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

export class Database {
  static async init() {
    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        tier VARCHAR(20) DEFAULT 'free',
        generations_used INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

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
  }

  static async createUser(email: string): Promise<User> {
    const [user] = await sql`
      INSERT INTO users (email)
      VALUES (${email})
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

  static async updateUserTier(userId: string, tier: string): Promise<void> {
    await sql`
      UPDATE users 
      SET tier = ${tier}, updated_at = NOW()
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
}
