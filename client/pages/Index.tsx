// ... existing code ...
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  Code,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  ChevronRight,
  Star,
  ArrowRight,
  Play,
  Users,
  Shield,
  Infinity,
  RefreshCw,
  Crown,
  Palette,
  Download,
} from "lucide-react";

export default function Index() {
  const [buildPrompt, setBuildPrompt] = useState("");
  const user = useUser();

  const handleBuildSubmit = async () => {
    if (!buildPrompt.trim()) return;
    // Check if user is logged in
    if (!user.isSignedIn) {
      // Redirect to auth with the prompt stored
      localStorage.setItem("pending_build_prompt", buildPrompt);
      localStorage.setItem("redirect_after_auth", "/neon-city?mode=code");
      window.location.href = "/auth";
      return;
    }
    // User is logged in, redirect to Neon City with v0 mode
    window.location.href = `/neon-city?mode=code&prompt=${encodeURIComponent(buildPrompt)}`;
  };

  const handleFeatureClick = (feature: string) => {
    if (!user.isSignedIn) {
      localStorage.setItem("redirect_after_auth", `/neon-city?mode=${feature}`);
      window.location.href = "/auth";
      return;
    }
    window.location.href = `/neon-city?mode=${feature}`;
  };

  // ... rest of the clean Index.tsx code ...