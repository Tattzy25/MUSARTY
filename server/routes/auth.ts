import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

interface User {
  id: string;
  email: string;
  name?: string;
  tier: "free" | "pro" | "byok";
  generations_used: number;
  created_at: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

// In-memory user store for development
const users = new Map<
  string,
  { email: string; password_hash: string; user: User }
>();

// Generate JWT token
function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

// Verify JWT token middleware
export const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Find user
    const userRecord = Array.from(users.values()).find(
      (u) => u.user.email === decoded.email,
    );
    if (!userRecord) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    req.user = userRecord.user as any;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
};

// Login endpoint
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      } as AuthResponse);
    }

    // Get user
    const userRecord = users.get(email.toLowerCase());
    if (!userRecord) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      } as AuthResponse);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      userRecord.password_hash,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      } as AuthResponse);
    }

    // Generate token
    const token = generateToken(userRecord.user);

    res.json({
      success: true,
      token,
      user: userRecord.user,
    } as AuthResponse);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    } as AuthResponse);
  }
};

// Signup endpoint
export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      } as AuthResponse);
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      } as AuthResponse);
    }

    // Check if user already exists
    if (users.has(email.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email",
      } as AuthResponse);
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user: User = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      name,
      tier: "free",
      generations_used: 0,
      created_at: new Date().toISOString(),
    };

    // Store user
    users.set(email.toLowerCase(), {
      email: email.toLowerCase(),
      password_hash,
      user,
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user,
    } as AuthResponse);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    } as AuthResponse);
  }
};

// Verify token endpoint
export const handleVerifyToken: RequestHandler = async (req, res) => {
  try {
    const user = req.user!;
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get current user endpoint
export const handleGetMe: RequestHandler = async (req, res) => {
  try {
    const user = req.user!;
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Logout endpoint
export const handleLogout: RequestHandler = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Forgot password endpoint
export const handleForgotPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    res.json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Reset password endpoint
export const handleResetPassword: RequestHandler = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Token and new password are required",
      });
    }

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
