import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
<<<<<<< HEAD
=======
  tier: "free" | "pro" | "byok";
  generations_used: number;
  created_at: string;
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
<<<<<<< HEAD
=======
  refreshUser: () => Promise<void>;
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    // Check for existing session
    const savedUser = localStorage.getItem("musarty_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("musarty_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password
      const user: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split("@")[0],
      };

      setUser(user);
      localStorage.setItem("musarty_user", JSON.stringify(user));

      // Check for pending redirect
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
=======
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

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store JWT token
      localStorage.setItem("musarty_token", data.token);
      setUser(data.user);

      // Initialize user in Shot Caller system (optional, don't fail if it doesn't work)
      try {
        const initResponse = await fetch("/api/users/initialize", {
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
        // Don't read the response body unless we need to
        if (!initResponse.ok) {
          console.warn("Failed to initialize user blocks");
        }
      } catch (initError) {
        console.warn("User initialization failed:", initError);
      }

      // Handle redirects - always go to pricing after login
      localStorage.removeItem("pending_build_prompt");
      localStorage.removeItem("redirect_after_auth");
      window.location.href = "/pricing";
    } catch (error) {
      console.error("Login error:", error);
      throw error;
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
<<<<<<< HEAD
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, create user immediately
      const user: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split("@")[0],
      };

      setUser(user);
      localStorage.setItem("musarty_user", JSON.stringify(user));

      // Initialize user with starting blocks
      await fetch("/api/users/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, starting_blocks: 10 }),
      });

      // Check for pending redirect
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
=======
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Store JWT token
      localStorage.setItem("musarty_token", data.token);
      setUser(data.user);

      // Initialize user in Shot Caller system (optional, don't fail if it doesn't work)
      try {
        const initResponse = await fetch("/api/users/initialize", {
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
        // Don't read the response body unless we need to
        if (!initResponse.ok) {
          console.warn("Failed to initialize user blocks");
        }
      } catch (initError) {
        console.warn("User initialization failed:", initError);
      }

      // Handle redirects - always go to pricing after signup
      localStorage.removeItem("pending_build_prompt");
      localStorage.removeItem("redirect_after_auth");
      window.location.href = "/pricing";
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const logout = () => {
    setUser(null);
    localStorage.removeItem("musarty_user");
    window.location.href = "/";
  };

  const forgotPassword = async (email: string) => {
    // Simulate forgot password
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Password reset link sent to ${email}`);
=======
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
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a
  };

  const value: AuthContextType = {
    user,
    isSignedIn: !!user,
    isLoading,
    login,
    signup,
    logout,
    forgotPassword,
<<<<<<< HEAD
=======
    refreshUser,
>>>>>>> 137b0324b0b9dfacab89742c629e1974076f353a
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
