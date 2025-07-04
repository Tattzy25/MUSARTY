import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  tier: "free" | "pro" | "byok";
  generations_used: number;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("musarty_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // Invalid token, remove it
        localStorage.removeItem("musarty_token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("musarty_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: "Login failed" };
        }
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();

      // Store JWT token
      localStorage.setItem("musarty_token", data.token);
      setUser(data.user);

      // Initialize user in Shot Caller system
      await fetch("/api/users/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          user_id: data.user.id,
          starting_blocks: 10,
        }),
      });

      // Handle redirects
      const pendingPrompt = localStorage.getItem("pending_build_prompt");
      const redirectAfterAuth = localStorage.getItem("redirect_after_auth");

      if (pendingPrompt && redirectAfterAuth) {
        localStorage.removeItem("pending_build_prompt");
        localStorage.removeItem("redirect_after_auth");
        window.location.href = `${redirectAfterAuth}&prompt=${encodeURIComponent(pendingPrompt)}`;
      } else if (redirectAfterAuth) {
        localStorage.removeItem("redirect_after_auth");
        window.location.href = redirectAfterAuth;
      } else {
        window.location.href = "/neon-city";
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: "Signup failed" };
        }
        throw new Error(errorData.error || "Signup failed");
      }

      const data = await response.json();

      // Store JWT token
      localStorage.setItem("musarty_token", data.token);
      setUser(data.user);

      // Initialize user in Shot Caller system
      await fetch("/api/users/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          user_id: data.user.id,
          starting_blocks: 10,
        }),
      });

      // Handle redirects
      const pendingPrompt = localStorage.getItem("pending_build_prompt");
      const redirectAfterAuth = localStorage.getItem("redirect_after_auth");

      if (pendingPrompt && redirectAfterAuth) {
        localStorage.removeItem("pending_build_prompt");
        localStorage.removeItem("redirect_after_auth");
        window.location.href = `${redirectAfterAuth}&prompt=${encodeURIComponent(pendingPrompt)}`;
      } else if (redirectAfterAuth) {
        localStorage.removeItem("redirect_after_auth");
        window.location.href = redirectAfterAuth;
      } else {
        window.location.href = "/neon-city";
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("musarty_token");
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("musarty_token");
      window.location.href = "/";
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      alert(`Password reset link sent to ${email}`);
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("musarty_token");
      if (!token) return;

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isSignedIn: !!user,
    isLoading,
    login,
    signup,
    logout,
    forgotPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to simulate Stack's useUser for compatibility
export function useUser() {
  const auth = useAuth();
  return {
    isSignedIn: auth.isSignedIn,
    user: auth.user,
  };
}
