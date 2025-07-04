import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("musarty_user");
    window.location.href = "/";
  };

  const forgotPassword = async (email: string) => {
    // Simulate forgot password
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Password reset link sent to ${email}`);
  };

  const value: AuthContextType = {
    user,
    isSignedIn: !!user,
    isLoading,
    login,
    signup,
    logout,
    forgotPassword,
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
