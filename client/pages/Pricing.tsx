import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Zap,
  Sparkles,
  Crown,
  ChevronRight,
  Star,
  Infinity,
  Key,
  Palette,
  Music,
  Video,
  Code,
  Image as ImageIcon,
} from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  // Check if user came here after exhausting free generations
  const searchParams = new URLSearchParams(window.location.search);
  const isUpgrade = searchParams.get("upgrade") === "true";

  const features = {
    free: [
      {
        icon: Sparkles,
        text: "3 free generations of anything",
        highlight: true,
      },
      { icon: ImageIcon, text: "Text, image, video, or music generation" },
      { icon: Zap, text: "Access to basic AI tools" },
      { icon: Check, text: "No credit card required" },
    ],
    paid: [
      { icon: Crown, text: "All free features included", highlight: true },
      {
        icon: Infinity,
        text: "Unlimited text with your API keys (BYOK)",
        highlight: true,
      },
      { icon: Star, text: "Access to all 29 AI models", highlight: true },
      { icon: Palette, text: "Advanced image generation" },
      { icon: Video, text: "Video generation tools" },
      { icon: Music, text: "Music generation & downloads" },
      { icon: Code, text: "V0 builder access" },
      { icon: Key, text: "Bring your own API keys option" },
    ],
  };

  const payAsYouGo = [
    { type: "Text Generation", amount: "1,000 characters", cost: "1 block" },
    { type: "Image Generation", amount: "4 images", cost: "1 block" },
    { type: "Video Generation", amount: "500 characters", cost: "1 block" },
    {
      type: "Music Download",
      amount: "1 track (license only)",
      cost: "1 block",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center py-12 space-y-8">
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-medium neon-border text-fire-orange"
            >
              <Crown className="w-4 h-4 mr-2" />
              Unlock the Full Power of AI
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Start free with 3 generations, then unlock unlimited possibilities
              with our pay-as-you-go system
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Free Tier */}
          <Card className="glass-strong neon-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fire-orange to-fire-red" />
            <CardHeader className="text-center pb-8">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-fire-orange/20 rounded-full blur-xl" />
                <div className="relative flex items-center justify-center w-full h-full glass rounded-full neon-border">
                  <Sparkles className="w-8 h-8 text-fire-orange" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">Free Tier</h3>
              <p className="text-muted-foreground">Perfect to get started</p>
              <div className="py-4">
                <span className="text-4xl font-bold text-fire-orange">
                  Free
                </span>
                <span className="text-muted-foreground ml-2">forever</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {features.free.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`p-1 rounded-full ${feature.highlight ? "bg-fire-orange/20" : "bg-muted/20"}`}
                    >
                      <feature.icon
                        className={`w-4 h-4 ${feature.highlight ? "text-fire-orange" : "text-muted-foreground"}`}
                      />
                    </div>
                    <span
                      className={
                        feature.highlight
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full glass hover:neon-border"
                variant="outline"
                asChild
              >
                <Link to="/">
                  Get Started Free
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Paid Tier */}
          <Card className="glass-strong neon-border relative overflow-hidden border-fire-orange/50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow" />
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-fire-orange to-fire-red text-black font-bold px-4 py-1">
              MOST POPULAR
            </Badge>
            <CardHeader className="text-center pb-8 pt-8">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-fire-orange/30 rounded-full blur-xl animate-pulse" />
                <div className="relative flex items-center justify-center w-full h-full glass rounded-full neon-border border-fire-orange/50">
                  <Crown className="w-8 h-8 text-fire-orange" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">Pro Unlimited</h3>
              <p className="text-muted-foreground">
                Everything you need to create
              </p>
              <div className="py-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-fire-orange to-fire-red bg-clip-text text-transparent">
                  $4.99
                </span>
                <span className="text-muted-foreground ml-2">
                  one-time unlock
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {features.paid.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`p-1 rounded-full ${feature.highlight ? "bg-fire-orange/20" : "bg-muted/20"}`}
                    >
                      <feature.icon
                        className={`w-4 h-4 ${feature.highlight ? "text-fire-orange" : "text-muted-foreground"}`}
                      />
                    </div>
                    <span
                      className={
                        feature.highlight
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-fire-orange to-fire-red hover:from-fire-orange/80 hover:to-fire-red/80 text-black font-bold neon-glow"
                asChild
              >
                <Link to="/checkout">
                  Unlock Pro Features
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pay-as-you-go Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Pay-as-you-go Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              When using our API keys, you'll pay only for what you use. Bring
              your own keys for unlimited text generation.
            </p>
          </div>

          <Card className="glass-strong neon-border">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {payAsYouGo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 glass rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{item.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.amount}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="neon-border text-fire-orange"
                    >
                      {item.cost}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 glass rounded-lg border border-fire-orange/30">
                <div className="flex items-center space-x-3 mb-4">
                  <Key className="w-6 h-6 text-fire-orange" />
                  <h3 className="text-lg font-bold">
                    Bring Your Own API Keys (BYOK)
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Connect your own OpenAI, Stability AI, or other provider keys
                  for:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-fire-orange" />
                    <span>
                      Unlimited text generation at your provider's rates
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-fire-orange" />
                    <span>Direct billing to your account</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-fire-orange" />
                    <span>No additional markup fees</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>

          <div className="grid gap-6 text-left">
            <Card className="glass-strong">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">
                  What happens after my 3 free generations?
                </h3>
                <p className="text-muted-foreground">
                  You'll need to upgrade to the Pro plan for $4.99 to continue
                  using our AI tools. This unlocks all features and access to 29
                  AI models.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">
                  How does the BYOK system work?
                </h3>
                <p className="text-muted-foreground">
                  Bring Your Own API Keys lets you connect your own provider
                  accounts (OpenAI, Stability AI, etc.) for direct billing and
                  unlimited usage at your provider's rates.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">
                  What's included in music downloads?
                </h3>
                <p className="text-muted-foreground">
                  Music downloads include a license to use the generated track,
                  but you don't own the copyright. Perfect for personal
                  projects, presentations, and content creation.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="pt-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-fire-orange to-fire-red hover:from-fire-orange/80 hover:to-fire-red/80 text-black font-bold neon-glow"
              asChild
            >
              <Link to="/checkout">
                Start Creating Today
                <Sparkles className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
