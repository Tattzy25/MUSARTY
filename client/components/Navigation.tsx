import { Link, useLocation } from "react-router-dom";
import { Settings, Zap, Code, FileImage, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    {
      name: "Converter",
      href: "/",
      icon: FileImage,
      isActive: location.pathname === "/",
    },
    {
      name: "Neon City",
      href: "/neon-city",
      icon: Sparkles,
      isActive: location.pathname === "/neon-city",
    },
    {
      name: "AI Arena",
      href: "/providers",
      icon: Trophy,
      isActive: location.pathname === "/providers",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      isActive: location.pathname === "/settings",
    },
  ];

  return (
    <nav className="glass-strong border-b border-glass-border/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-fire-orange/20 rounded-lg blur-xl group-hover:bg-fire-orange/30 transition-all duration-300" />
              <div className="relative flex items-center justify-center w-10 h-10 glass rounded-lg neon-border">
                <Zap className="w-6 h-6 text-fire-orange group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Musarty
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Music • Art • AI Creation
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                  "hover:glass hover:neon-border hover:scale-105",
                  item.isActive &&
                    "glass neon-border bg-primary/10 text-primary",
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 glass rounded-full">
              <div className="w-2 h-2 bg-fire-orange rounded-full pulse-glow" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cyber scan line */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-fire-orange to-transparent opacity-20" />
    </nav>
  );
}
