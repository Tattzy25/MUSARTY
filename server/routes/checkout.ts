import { RequestHandler } from "express";
import { CheckoutRequest, CheckoutResponse, PricingPlan } from "@shared/api";
import { PaymentService } from "../services/payment.js";
import { Database } from "../db/neon.js";
import { verifyToken } from "./auth.js";

// Production pricing plans
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
      "Access to all 24 AI models",
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
    const user = req.user; // Get user from auth middleware

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      } as CheckoutResponse);
    }

    // Basic validation
    if (!checkoutData.planId) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: planId",
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

    // Check if PayPal is configured
    if (!PaymentService.isConfigured()) {
      return res.status(500).json({
        success: false,
        error: "Payment service not configured. Please contact administrator.",
      } as CheckoutResponse);
    }

    // Create PayPal payment
    const payment = await PaymentService.createPayment({
      amount: plan.price,
      currency: plan.currency,
      description: plan.name,
      returnUrl: `${process.env.FRONTEND_URL || "http://localhost:8080"}/checkout/success`,
      cancelUrl: `${process.env.FRONTEND_URL || "http://localhost:8080"}/checkout/cancel`,
    });

    // Store payment in database
    await Database.createPayment(user.id, plan.price, payment.id);

    const response: CheckoutResponse = {
      success: true,
      data: {
        sessionId: payment.id,
        status: "pending",
        orderId: payment.id,
        paymentUrl: payment.approvalUrl,
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

export const handleCompletePayment: RequestHandler = async (req, res) => {
  try {
    const { paymentId, payerId } = req.body;

    // Capture the payment
    const captureResult = await PaymentService.capturePayment(paymentId);

    if (captureResult.status === "COMPLETED") {
      // Update payment status in database
      await Database.updatePaymentStatus(paymentId, "completed");

      // Get payment details to find user
      const paymentDetails = await PaymentService.getPaymentDetails(paymentId);
      const payer = paymentDetails.payer;

      // Update user tier to pro
      const user = await Database.getUserByEmail(payer.email_address);
      if (user) {
        await Database.updateUserTier(user.id, "pro");
      }

      res.json({ success: true, message: "Payment completed successfully" });
    } else {
      await Database.updatePaymentStatus(paymentId, "failed");
      res.status(400).json({
        success: false,
        error: "Payment capture failed",
      });
    }
  } catch (error) {
    console.error("Payment completion failed:", error);
    res.status(500).json({
      success: false,
      error: "Payment completion failed",
    });
  }
};

export const handleGetSubscription: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.query;

    // Get user from database
    let user;
    if (email) {
      user = await Database.getUserByEmail(email as string);
    } else {
      return res.status(400).json({
        success: false,
        error: "Email parameter is required",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const plan =
      PRICING_PLANS.find((p) => p.id === user.tier) || PRICING_PLANS[0];

    const subscription = {
      id: `sub_${user.id}`,
      planId: user.tier,
      status: "active",
      startDate: user.created_at.toISOString(),
      remainingGenerations:
        user.tier === "free" ? Math.max(0, 3 - user.generations_used) : -1,
      features: plan.features,
      generationsUsed: user.generations_used,
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
