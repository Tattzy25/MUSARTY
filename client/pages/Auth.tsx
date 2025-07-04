import { useAuth } from "@/hooks/use-auth";
import AuthForm from "@/components/AuthForm";
import { Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Auth() {
  const { login, signup, forgotPassword } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/5 via-transparent to-fire-red/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-fire-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-fire-red/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:bg-primary/30 transition-all duration-300" />
              <div className="relative flex items-center justify-center w-12 h-12 glass rounded-lg neon-border">
                <Zap className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Musarty
              </h1>
              <p className="text-sm text-muted-foreground -mt-1">
                Music • Art • AI Creation
              </p>
            </div>
          </Link>
        </div>

        {/* Auth Form */}
        <div className="flex justify-center">
          <AuthForm
            onLogin={login}
            onSignup={signup}
            onForgotPassword={forgotPassword}
          />
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-fire-orange" />
            <span>3 free generations • No credit card required</span>
          </div>
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
