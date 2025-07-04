const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NODE_ENV } = process.env;

// PayPal API Base URLs
const PAYPAL_API_BASE =
  NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

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

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured");
  }

  try {
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": "en_US",
        Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(
        `PayPal auth failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // Refresh 1 min early

    console.log("✅ PayPal access token obtained");
    return accessToken;
  } catch (error) {
    console.error("❌ PayPal authentication failed:", error);
    throw new Error("Failed to authenticate with PayPal");
  }
}

export class PaymentService {
  static async createPayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("PayPal not configured");
    }

    try {
      const token = await getAccessToken();

      const orderData = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: request.currency,
              value: request.amount.toFixed(2),
            },
            description: request.description,
          },
        ],
        application_context: {
          return_url: request.returnUrl,
          cancel_url: request.cancelUrl,
          user_action: "PAY_NOW",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          },
        },
      };

      console.log("🔄 Creating PayPal order:", {
        amount: request.amount,
        currency: request.currency,
      });

      const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "PayPal-Request-Id": `ORDER-${Date.now()}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ PayPal order creation failed:", errorData);
        throw new Error(`PayPal order creation failed: ${response.status}`);
      }

      const order = await response.json();
      const approvalUrl = order.links?.find(
        (link: any) => link.rel === "approve",
      )?.href;

      console.log("✅ PayPal order created:", {
        orderId: order.id,
        status: order.status,
      });

      return {
        id: order.id,
        status: order.status,
        approvalUrl,
      };
    } catch (error) {
      console.error("❌ PayPal payment creation error:", error);
      throw error;
    }
  }

  static async capturePayment(
    orderId: string,
  ): Promise<{ status: string; details: any }> {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("PayPal not configured");
    }

    try {
      const token = await getAccessToken();

      console.log("🔄 Capturing PayPal payment:", orderId);

      const response = await fetch(
        `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "PayPal-Request-Id": `CAPTURE-${Date.now()}`,
          },
          body: JSON.stringify({}),
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ PayPal capture failed:", errorData);
        throw new Error(`PayPal capture failed: ${response.status}`);
      }

      const captureData = await response.json();

      console.log("✅ PayPal payment captured:", {
        orderId,
        status: captureData.status,
      });

      return {
        status: captureData.status,
        details: captureData,
      };
    } catch (error) {
      console.error("❌ PayPal capture error:", error);
      throw error;
    }
  }

  static async getPaymentDetails(orderId: string): Promise<any> {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("PayPal not configured");
    }

    try {
      const token = await getAccessToken();

      console.log("🔍 Getting PayPal order details:", orderId);

      const response = await fetch(
        `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ PayPal get order failed:", errorData);
        throw new Error(`PayPal get order failed: ${response.status}`);
      }

      const orderData = await response.json();
      return orderData;
    } catch (error) {
      console.error("❌ PayPal get order error:", error);
      throw error;
    }
  }

  static isConfigured(): boolean {
    return !!(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET);
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
      description: "Musarty - 10 Generation Blocks",
    },
    BLOCK_50: {
      amount: 7.99,
      currency: "USD",
      description: "Musarty - 50 Generation Blocks",
    },
    BLOCK_100: {
      amount: 14.99,
      currency: "USD",
      description: "Musarty - 100 Generation Blocks",
    },
  };
}
