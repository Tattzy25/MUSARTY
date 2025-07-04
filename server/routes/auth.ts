import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Database, User } from "../db/neon.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, "password_hash">;
  error?: string;
}

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

    // Get fresh user data
    const user = await Database.getUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    req.user = user;
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
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      } as AuthResponse);
    }

    // Get user from database
    const user = await Database.getUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      } as AuthResponse);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      } as AuthResponse);
    }

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token,
      user: userWithoutPassword,
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
    const { email, password, name }: SignupRequest = req.body;

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
    const existingUser = await Database.getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email",
      } as AuthResponse);
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await Database.createUser(
      email.toLowerCase(),
      password_hash,
      name,
    );

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const { password_hash: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword,
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
    // Token is already verified by middleware
    const user = req.user!;
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
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
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
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
    // In a real implementation, you might want to blacklist the token
    // For now, just send success response
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
    const { email }: ForgotPasswordRequest = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Check if user exists
    const user = await Database.getUserByEmail(email.toLowerCase());
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, type: "password_reset" },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Store reset token in database
    await Database.storePasswordResetToken(user.id, resetToken);

    // TODO: Send email with reset link
    // For now, just log it (in production, use a proper email service)
    console.log(
      `Password reset link for ${email}: /reset-password?token=${resetToken}`,
    );

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

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    // Verify reset token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type !== "password_reset") {
      return res.status(400).json({
        success: false,
        error: "Invalid reset token",
      });
    }

    // Check if token is still valid in database
    const isValidToken = await Database.verifyPasswordResetToken(
      decoded.userId,
      token,
    );
    if (!isValidToken) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await Database.updateUserPassword(decoded.userId, password_hash);

    // Invalidate reset token
    await Database.invalidatePasswordResetToken(decoded.userId);

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
