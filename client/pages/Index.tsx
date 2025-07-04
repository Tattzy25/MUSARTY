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
      window.location.href = "/handler/signup";
      return;
    }
    window.location.href = `/neon-city?mode=${feature}`;
  };

  const features = [
    {
      id: "text",
      name: "Text Generation",
      description: "AI-powered content creation with 10+ models",
      icon: FileText,
      color: "from-fire-orange to-fire-red",
      gradient: "bg-gradient-to-br from-fire-orange/20 to-fire-red/20",
    },
    {
      id: "image",
      name: "Image Creation",
      description: "DALL-E, Midjourney, Stability AI integration",
      icon: ImageIcon,
      color: "from-pink-400 to-red-500",
      gradient: "bg-gradient-to-br from-pink-400/20 to-red-500/20",
    },
    {
      id: "video",
      name: "Video Generation",
      description: "Runway Gen3 powered video creation",
      icon: Video,
      color: "from-purple-400 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-400/20 to-pink-500/20",
    },
    {
      id: "music",
      name: "Music Composition",
      description: "Suno AI for professional music generation",
      icon: Music,
      color: "from-emerald-400 to-green-500",
      gradient: "bg-gradient-to-br from-emerald-400/20 to-green-500/20",
    },
    {
      id: "code",
      name: "v0 Builder",
      description: "Generate React components and landing pages",
      icon: Code,
      color: "from-yellow-400 to-fire-orange",
      gradient: "bg-gradient-to-br from-yellow-400/20 to-fire-orange/20",
    },
    {
      id: "convert",
      name: "Image to Code",
      description: "Transform designs into React, HTML & CSS",
      icon: RefreshCw,
      color: "from-blue-400 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-400/20 to-cyan-500/20",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      content:
        "Musarty transformed my workflow. I can now generate entire design systems in minutes instead of hours.",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Developer",
      content:
        "The v0 integration is incredible. It generates production-ready React components that I actually use.",
      rating: 5,
      avatar: "MR",
    },
    {
      name: "Emily Watson",
      role: "Content Creator",
      content:
        "From music to images to videos - having all AI creation tools in one place is a game changer.",
      rating: 5,
      avatar: "EW",
    },
  ];

  const galleryItems = [
    {
      type: "image",
      title: "AI Generated Portrait",
      description: "Created with DALL-E 3",
      color: "from-pink-400 to-purple-500",
    },
    {
      type: "code",
      title: "React Dashboard",
      description: "Built with v0 in 30 seconds",
      color: "from-yellow-400 to-fire-orange",
    },
    {
      type: "music",
      title: "Ambient Soundtrack",
      description: "Composed with Suno AI",
      color: "from-emerald-400 to-green-500",
    },
    {
      type: "video",
      title: "Product Demo",
      description: "Generated with Runway Gen3",
      color: "from-purple-400 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="glass-strong border-b border-glass-border/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:bg-primary/30 transition-all duration-300" />
                <div className="relative flex items-center justify-center w-10 h-10 glass rounded-lg neon-border">
                  <Zap className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
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
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/providers"
                className="text-sm hover:text-fire-orange transition-colors"
              >
                AI Arena
              </Link>
              <Link
                to="/pricing"
                className="text-sm hover:text-fire-orange transition-colors"
              >
                Pricing
              </Link>
              <Button
                variant="outline"
                className="glass hover:neon-border"
                asChild
              >
                <Link to={user.isSignedIn ? "/neon-city" : "/handler/signup"}>
                  {user.isSignedIn ? "Dashboard" : "Get Started"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/5 via-transparent to-fire-red/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-fire-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fire-red/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm font-medium neon-border text-fire-orange mb-8"
          >
            <Crown className="w-4 h-4 mr-2" />
            24+ AI Models • One Platform
          </Badge>

          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            <span className="bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent">
              Create Anything
            </span>
            <br />
            <span className="text-foreground">With AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
            The ultimate AI creation hub. Generate text, images, videos, music,
            and code using the world's most powerful AI models. From GPT-4o to
            DALL-E, Claude to Suno AI.
          </p>

          {/* Main CTA Input */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="glass-strong neon-border p-2">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="What should we build today? Describe your idea..."
                  value={buildPrompt}
                  onChange={(e) => setBuildPrompt(e.target.value)}
                  className="flex-1 bg-transparent border-none text-lg px-6 py-4 placeholder:text-muted-foreground/60"
                  onKeyDown={(e) => e.key === "Enter" && handleBuildSubmit()}
                />
                <Button
                  onClick={handleBuildSubmit}
                  disabled={!buildPrompt.trim()}
                  className="bg-gradient-to-r from-fire-orange to-fire-red hover:from-fire-orange/80 hover:to-fire-red/80 text-black font-bold px-8 py-4 text-lg neon-glow"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Build with AI
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
            <p className="text-sm text-muted-foreground mt-3">
              ✨ Powered by v0 • 3 free generations • No credit card required
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 mb-16">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-fire-orange" />
              <span className="text-sm font-medium">10,000+ Creators</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-fire-orange fill-fire-orange" />
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-fire-orange" />
              <span className="text-sm font-medium">Enterprise Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent">
                All AI Tools
              </span>
              <br />
              <span className="text-foreground">In One Place</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stop switching between different AI platforms. Musarty unifies the
              best models into one seamless creation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card
                key={feature.id}
                className="glass-strong neon-border group cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => handleFeatureClick(feature.id)}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div
                    className={`relative mx-auto w-16 h-16 ${feature.gradient} rounded-2xl`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                    <div className="relative flex items-center justify-center w-full h-full">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-center text-fire-orange group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium mr-2">Try Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* V0 Showcase */}
          <Card className="glass-strong neon-border border-fire-orange/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 space-y-6">
                  <Badge className="bg-gradient-to-r from-fire-orange to-fire-red text-black font-bold">
                    ⭐ Featured: v0 Integration
                  </Badge>
                  <h3 className="text-3xl font-bold">
                    Generate React Components in Seconds
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Our v0 integration creates production-ready React
                    components, landing pages, and complete applications from
                    simple text descriptions.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-fire-orange rounded-full" />
                      <span>Production-ready React code</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-fire-orange rounded-full" />
                      <span>Tailwind CSS included</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-fire-orange rounded-full" />
                      <span>Mobile responsive design</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => handleFeatureClick("code")}
                    className="bg-gradient-to-r from-fire-orange to-fire-red hover:from-fire-orange/80 hover:to-fire-red/80 text-black font-bold"
                  >
                    <Code className="w-5 h-5 mr-2" />
                    Try v0 Builder
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-fire-orange/20 to-fire-red/20 p-12 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="relative mx-auto w-24 h-24 bg-gradient-to-br from-fire-orange to-fire-red rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                      <div className="relative flex items-center justify-center w-full h-full">
                        <Code className="w-12 h-12 text-black" />
                      </div>
                    </div>
                    <p className="text-lg font-medium">Live Code Generation</p>
                    <Button
                      variant="outline"
                      className="glass border-fire-orange/50 text-fire-orange hover:bg-fire-orange/10"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Demo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-br from-background to-fire-orange/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From idea to creation in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Describe Your Idea",
                description:
                  "Tell Musarty what you want to create using natural language",
                icon: FileText,
              },
              {
                step: "2",
                title: "AI Does the Work",
                description:
                  "Our intelligent system routes to the best AI model for your task",
                icon: Zap,
              },
              {
                step: "3",
                title: "Get Your Creation",
                description:
                  "Download, share, or iterate on your AI-generated content",
                icon: Download,
              },
            ].map((step, index) => (
              <Card key={index} className="glass-strong text-center p-8">
                <CardContent className="space-y-6">
                  <div className="relative mx-auto w-16 h-16">
                    <div className="absolute inset-0 bg-fire-orange/20 rounded-full blur-xl" />
                    <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-fire-orange to-fire-red rounded-full text-black font-bold text-xl">
                      {step.step}
                    </div>
                  </div>
                  <step.icon className="w-8 h-8 text-fire-orange mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent">
                Created with Musarty
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what our community is creating with AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryItems.map((item, index) => (
              <Card
                key={index}
                className="glass-strong group hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div
                    className={`h-48 bg-gradient-to-br ${item.color} relative`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        {item.type === "image" && (
                          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                        )}
                        {item.type === "code" && (
                          <Code className="w-12 h-12 mx-auto mb-2" />
                        )}
                        {item.type === "music" && (
                          <Music className="w-12 h-12 mx-auto mb-2" />
                        )}
                        {item.type === "video" && (
                          <Video className="w-12 h-12 mx-auto mb-2" />
                        )}
                        <h4 className="font-bold">{item.title}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-br from-background to-fire-orange/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by Creators
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of creators who trust Musarty for their AI needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-strong">
                <CardContent className="p-8 space-y-6">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-fire-orange text-fire-orange"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-fire-orange to-fire-red rounded-full flex items-center justify-center text-black font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-strong neon-border border-fire-orange/50 p-12">
            <CardContent className="space-y-8">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-fire-orange/30 rounded-full blur-xl animate-pulse" />
                <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-fire-orange to-fire-red rounded-full">
                  <Sparkles className="w-10 h-10 text-black" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Create?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join 10,000+ creators and start building with AI today
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  size="lg"
                  onClick={() =>
                    !user.isSignedIn
                      ? (window.location.href = "/handler/signup")
                      : (window.location.href = "/neon-city")
                  }
                  className="bg-gradient-to-r from-fire-orange to-fire-red hover:from-fire-orange/80 hover:to-fire-red/80 text-black font-bold px-8 py-4 text-lg neon-glow"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Creating Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="glass hover:neon-border px-8 py-4 text-lg"
                  asChild
                >
                  <Link to="/pricing">
                    <Crown className="w-6 h-6 mr-2" />
                    View Pricing
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                ✨ 3 free generations • No credit card required • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-fire-orange to-fire-red rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold">Musarty</span>
              </div>
              <p className="text-muted-foreground">
                The ultimate AI creation hub for music, art, and everything in
                between.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <Link
                  to="/neon-city"
                  className="block text-sm text-muted-foreground hover:text-fire-orange"
                >
                  AI Generation
                </Link>
                <Link
                  to="/providers"
                  className="block text-sm text-muted-foreground hover:text-fire-orange"
                >
                  AI Arena
                </Link>
                <Link
                  to="/pricing"
                  className="block text-sm text-muted-foreground hover:text-fire-orange"
                >
                  Pricing
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-fire-orange"
                >
                  About
                </a>
                <a
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-fire-orange"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-fire-orange"
                >
                  Careers
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-fire-orange"
                >
                  Documentation
                </a>
                <a
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-fire-orange"
                >
                  Help Center
                </a>
                <a
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-fire-orange"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/30 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Musarty. All rights reserved. Built with 🔥 for creators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
