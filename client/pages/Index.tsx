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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Create with AI</h1>
            <p className="text-muted-foreground">
              Transform your ideas into reality with our AI-powered creative suite
            </p>
          </div>

          {/* Build Prompt Section */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your creative prompt..."
                value={buildPrompt}
                onChange={(e) => setBuildPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBuildSubmit()}
              />
              <Button onClick={handleBuildSubmit}>
                Build <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="cursor-pointer hover:bg-accent/50 transition"
              onClick={() => handleFeatureClick("code")}
            >
              <CardContent className="p-6 space-y-2">
                <Code className="h-8 w-8" />
                <h3 className="font-semibold">Code Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Generate code snippets and full applications
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-accent/50 transition"
              onClick={() => handleFeatureClick("image")}
            >
              <CardContent className="p-6 space-y-2">
                <ImageIcon className="h-8 w-8" />
                <h3 className="font-semibold">Image Creation</h3>
                <p className="text-sm text-muted-foreground">
                  Create stunning AI-generated images
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-accent/50 transition"
              onClick={() => handleFeatureClick("video")}
            >
              <CardContent className="p-6 space-y-2">
                <Video className="h-8 w-8" />
                <h3 className="font-semibold">Video Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Transform text into engaging videos
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-accent/50 transition"
              onClick={() => handleFeatureClick("music")}
            >
              <CardContent className="p-6 space-y-2">
                <Music className="h-8 w-8" />
                <h3 className="font-semibold">Music Composition</h3>
                <p className="text-sm text-muted-foreground">
                  Create original music and audio
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold">AI-Powered Creation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                State-of-the-art AI models for creative generation
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <h3 className="font-semibold">Lightning Fast</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Get results in seconds with our optimized infrastructure
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <h3 className="font-semibold">Secure & Private</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your data is encrypted and protected
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold">Collaboration</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Work together with team members seamlessly
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Infinity className="h-5 w-5" />
                <h3 className="font-semibold">Unlimited Potential</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                No limits on your creative possibilities
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                <h3 className="font-semibold">Continuous Updates</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Regular improvements and new features
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Ready to Create?</h2>
            <p className="text-muted-foreground">
              Join thousands of creators using our platform
            </p>
            <Button asChild size="lg">
              <Link to="/auth">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
