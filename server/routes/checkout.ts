import { RequestHandler } from "express";
import { CheckoutRequest, CheckoutResponse, PricingPlan } from "@shared/api";

// Mock pricing plans - in production, this would come from a database
const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free Tier",
    price: 0,
    currency: "USD",
    interval: "one-time",
    features: [
      "3 free generations",
      "Text, image, video, or music",
      "Basic AI tools",
      "No credit card required",
    ],
  },
  {
    id: "pro",
    name: "Pro Unlimited",
    price: 4.99,
    currency: "USD",
    interval: "one-time",
    popular: true,
    features: [
      "Unlimited text with BYOK",
      "Access to all 29 AI models",
      "Advanced image generation",
      "Video generation tools",
      "Music generation & downloads",
      "V0 builder access",
      "Bring your own API keys",
    ],
  },
];

export const handleGetPricing: RequestHandler = (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        plans: PRICING_PLANS,
      },
    });
  } catch (error) {
    console.error("Error fetching pricing:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch pricing plans",
    });
  }
};

export const handleCheckout: RequestHandler = async (req, res) => {
  try {
    const checkoutData: CheckoutRequest = req.body;

    // Basic validation
    if (!checkoutData.planId || !checkoutData.customerInfo?.email) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: planId and email",
      } as CheckoutResponse);
    }

    // Find the plan
    const plan = PRICING_PLANS.find((p) => p.id === checkoutData.planId);
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: "Invalid plan ID",
      } as CheckoutResponse);
    }

    // For free plan, no payment needed
    if (plan.price === 0) {
      return res.json({
        success: true,
        data: {
          sessionId: `free_${Date.now()}`,
          status: "completed",
          orderId: `order_free_${Date.now()}`,
        },
      } as CheckoutResponse);
    }

    // Mock payment processing for demo
    // In production, integrate with Stripe, PayPal, etc.
    const sessionId = `session_${Date.now()}`;
    const orderId = `order_${Date.now()}`;

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful payment
    const response: CheckoutResponse = {
      success: true,
      data: {
        sessionId,
        status: "completed",
        orderId,
        paymentUrl:
          checkoutData.paymentMethod === "paypal"
            ? `https://paypal.com/checkout/${sessionId}`
            : undefined,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process checkout",
    } as CheckoutResponse);
  }
};

export const handleGetSubscription: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;

    // Mock user subscription data
    // In production, fetch from database
    const subscription = {
      id: `sub_${userId}`,
      planId: "pro",
      status: "active",
      startDate: new Date().toISOString(),
      remainingGenerations: 3,
      features: PRICING_PLANS.find((p) => p.id === "pro")?.features || [],
      billingHistory: [
        {
          date: new Date().toISOString(),
          amount: 4.99,
          status: "completed",
          description: "Pro Unlimited Access",
        },
      ],
    };

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch subscription",
    });
  }
};
