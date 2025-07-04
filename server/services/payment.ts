import pkg from "@paypal/paypal-server-sdk";
const { PayPalApi, core } = pkg;

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NODE_ENV } = process.env;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.warn(
    "⚠️  PayPal credentials not found. Payment functionality will be disabled.",
  );
  console.warn(
    "Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.",
  );
}

let client: PayPalApi | null = null;

if (PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET) {
  try {
    client = new PayPalApi({
      clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_CLIENT_ID,
        oAuthClientSecret: PAYPAL_CLIENT_SECRET,
      },
      environment:
        NODE_ENV === "production"
          ? core.Environment.Production
          : core.Environment.Sandbox,
      logging: {
        logLevel: core.LogLevel.INFO,
      },
    });
    console.log("✅ PayPal client initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize PayPal client:", error);
  }
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentResponse {
  id: string;
  status: string;
  approvalUrl?: string;
}

export class PaymentService {
  static async createPayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    if (!client) {
      throw new Error(
        "PayPal client not initialized. Please check your PayPal credentials.",
      );
    }

    try {
      const createRequest = {
        body: {
          intent: "CAPTURE",
          purchaseUnits: [
            {
              amount: {
                currencyCode: request.currency,
                value: request.amount.toFixed(2),
              },
              description: request.description,
            },
          ],
          applicationContext: {
            returnUrl: request.returnUrl,
            cancelUrl: request.cancelUrl,
            userAction: "PAY_NOW",
            paymentMethod: {
              payerSelected: "PAYPAL",
              payeePreferred: "IMMEDIATE_PAYMENT_REQUIRED",
            },
          },
        },
      };

      console.log("🔄 Creating PayPal payment:", {
        amount: request.amount,
        currency: request.currency,
        description: request.description,
      });

      const response = await client.orders.ordersCreate(createRequest);
      const order = response.result;

      if (!order.id) {
        throw new Error("PayPal order creation failed - no order ID returned");
      }

      const approvalUrl = order.links?.find(
        (link) => link.rel === "approve",
      )?.href;

      console.log("✅ PayPal payment created:", {
        orderId: order.id,
        status: order.status,
        hasApprovalUrl: !!approvalUrl,
      });

      return {
        id: order.id,
        status: order.status!,
        approvalUrl,
      };
    } catch (error) {
      console.error("❌ PayPal payment creation failed:", error);
      if (error instanceof Error) {
        throw new Error(`PayPal payment creation failed: ${error.message}`);
      }
      throw new Error("PayPal payment creation failed with unknown error");
    }
  }

  static async capturePayment(
    orderId: string,
  ): Promise<{ status: string; details: any }> {
    if (!client) {
      throw new Error("PayPal client not initialized");
    }

    try {
      console.log("🔄 Capturing PayPal payment:", orderId);

      const response = await client.orders.ordersCapture({
        id: orderId,
        body: {},
      });

      console.log("✅ PayPal payment captured:", {
        orderId,
        status: response.result.status,
      });

      return {
        status: response.result.status!,
        details: response.result,
      };
    } catch (error) {
      console.error("❌ PayPal payment capture failed:", error);
      if (error instanceof Error) {
        throw new Error(`PayPal payment capture failed: ${error.message}`);
      }
      throw new Error("PayPal payment capture failed with unknown error");
    }
  }

  static async getPaymentDetails(orderId: string): Promise<any> {
    if (!client) {
      throw new Error("PayPal client not initialized");
    }

    try {
      console.log("🔍 Getting PayPal payment details:", orderId);

      const response = await client.orders.ordersGet({
        id: orderId,
      });

      return response.result;
    } catch (error) {
      console.error("❌ PayPal payment details retrieval failed:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get payment details: ${error.message}`);
      }
      throw new Error("Failed to get payment details with unknown error");
    }
  }

  static isConfigured(): boolean {
    return !!client && !!PAYPAL_CLIENT_ID && !!PAYPAL_CLIENT_SECRET;
  }

  // Pre-configured payment amounts
  static readonly PRICING = {
    PRO_TIER: {
      amount: 4.99,
      currency: "USD",
      description: "Musarty Pro - Unlimited AI Generations",
    },
    BLOCK_10: {
      amount: 1.99,
      currency: "USD",
      description: "Musarty - 10 Generation Block",
    },
    BLOCK_50: {
      amount: 7.99,
      currency: "USD",
      description: "Musarty - 50 Generation Block",
    },
    BLOCK_100: {
      amount: 14.99,
      currency: "USD",
      description: "Musarty - 100 Generation Block",
    },
  };
}
