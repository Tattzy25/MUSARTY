import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  Shield,
  CreditCard,
  Lock,
  Check,
  ArrowLeft,
  Sparkles,
  Star,
  Infinity,
  Key,
  Palette,
  Music,
  Video,
  Code,
} from "lucide-react";

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const features = [
    { icon: Infinity, text: "Unlimited text with your API keys" },
    { icon: Star, text: "Access to all 29 AI models" },
    { icon: Palette, text: "Advanced image generation" },
    { icon: Video, text: "Video generation tools" },
    { icon: Music, text: "Music generation & downloads" },
    { icon: Code, text: "V0 builder access" },
    { icon: Key, text: "Bring your own API keys option" },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page or dashboard
      alert("Payment successful! Welcome to Pro!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" className="glass hover:neon-border" asChild>
            <Link to="/pricing">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm font-medium neon-border text-fire-orange mb-4"
          >
            <Crown className="w-4 h-4 mr-2" />
            Pro Unlimited Checkout
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-fire-orange via-fire-red to-fire-yellow bg-clip-text text-transparent mb-4">
            Complete Your Upgrade
          </h1>
          <p className="text-xl text-muted-foreground">
            Unlock unlimited AI creation in just one step
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Payment Form */}
          <div className="space-y-8">
            <Card className="glass-strong neon-border">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 glass rounded-lg">
                    <CreditCard className="w-5 h-5 text-fire-orange" />
                  </div>
                  <h2 className="text-xl font-bold">Payment Information</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Methods */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 rounded-lg border transition-all ${
                        paymentMethod === "card"
                          ? "glass neon-border bg-fire-orange/10"
                          : "glass border-muted"
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2 text-fire-orange" />
                      <span className="text-sm font-medium">Credit Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("paypal")}
                      className={`p-4 rounded-lg border transition-all ${
                        paymentMethod === "paypal"
                          ? "glass neon-border bg-fire-orange/10"
                          : "glass border-muted"
                      }`}
                    >
                      <div className="w-6 h-6 mx-auto mb-2 bg-fire-orange/20 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-fire-orange">
                          PP
                        </span>
                      </div>
                      <span className="text-sm font-medium">PayPal</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="glass neon-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card">Card Information</Label>
                      <div className="space-y-3">
                        <Input
                          id="card"
                          placeholder="1234 5678 9012 3456"
                          className="glass neon-border"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="MM / YY"
                            className="glass neon-border"
                          />
                          <Input
                            placeholder="CVC"
                            className="glass neon-border"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input
                        id="name"
                        placeholder="Full name on card"
                        className="glass neon-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <select className="w-full p-3 glass neon-border rounded-lg bg-background text-foreground">
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You'll be redirected to PayPal to complete your payment
                      securely.
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="w-4 h-4 text-fire-orange" />
                      <span className="text-sm text-fire-orange">
                        Secured by PayPal
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="glass-strong border-muted/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Lock className="w-5 h-5 text-fire-orange" />
                  <h3 className="font-medium">Secure Payment</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your payment information is encrypted and secure. We use
                  industry-standard SSL encryption to protect your data.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-8">
            <Card className="glass-strong neon-border border-fire-orange/50">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-fire-orange/30 rounded-lg blur-xl" />
                    <div className="relative p-2 glass rounded-lg neon-border">
                      <Crown className="w-5 h-5 text-fire-orange" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Pro Unlimited</h2>
                    <p className="text-sm text-muted-foreground">
                      One-time unlock
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Pro Unlimited Access</span>
                    <span className="font-medium">$4.99</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Processing Fee</span>
                    <span>$0.00</span>
                  </div>
                  <Separator className="bg-border/30" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-fire-orange">$4.99</span>
                  </div>
                </div>

                {/* What's Included */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm uppercase tracking-wide text-fire-orange">
                    What's Included
                  </h3>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="p-1 rounded-full bg-fire-orange/20">
                          <feature.icon className="w-3 h-3 text-fire-orange" />
                        </div>
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-border/30" />

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-12 bg-gradient-to-r from-fire-orange to-fire-red hover:from-fire-orange/80 hover:to-fire-red/80 text-black font-bold text-lg neon-glow disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Complete Payment - $4.99</span>
                      <Crown className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By completing your purchase, you agree to our Terms of Service
                  and Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Money Back Guarantee */}
            <Card className="glass-strong border-green-500/30">
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto w-12 h-12 mb-4">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                  <div className="relative flex items-center justify-center w-full h-full glass rounded-full border-green-500/50">
                    <Shield className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">30-Day Money Back Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  Not satisfied? Get a full refund within 30 days, no questions
                  asked.
                </p>
              </CardContent>
            </Card>

            {/* Testimonial */}
            <Card className="glass-strong">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-fire-orange text-fire-orange"
                    />
                  ))}
                </div>
                <p className="text-sm italic mb-3">
                  "The unlimited text generation with my own API keys saved me
                  hundreds of dollars. Best AI tool investment I've made!"
                </p>
                <p className="text-xs text-muted-foreground">
                  — Sarah K., Content Creator
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Trusted by thousands of creators worldwide
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span className="text-sm">PCI Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span className="text-sm">GDPR Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
