import { PayPalApi, core } from "@paypal/paypal-server-sdk";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NODE_ENV } = process.env;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  throw new Error("PayPal credentials are required");
}

const client = new PayPalApi({
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
    try {
      const createRequest = {
        body: {
          intent: "CAPTURE",
          purchaseUnits: [
            {
              amount: {
                currencyCode: request.currency,
                value: request.amount.toString(),
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

      const response = await client.orders.ordersCreate(createRequest);
      const order = response.result;

      const approvalUrl = order.links?.find(
        (link) => link.rel === "approve",
      )?.href;

      return {
        id: order.id!,
        status: order.status!,
        approvalUrl,
      };
    } catch (error) {
      console.error("PayPal payment creation failed:", error);
      throw new Error("Failed to create payment");
    }
  }

  static async capturePayment(
    orderId: string,
  ): Promise<{ status: string; details: any }> {
    try {
      const response = await client.orders.ordersCapture({
        id: orderId,
        body: {},
      });

      return {
        status: response.result.status!,
        details: response.result,
      };
    } catch (error) {
      console.error("PayPal payment capture failed:", error);
      throw new Error("Failed to capture payment");
    }
  }

  static async getPaymentDetails(orderId: string): Promise<any> {
    try {
      const response = await client.orders.ordersGet({
        id: orderId,
      });

      return response.result;
    } catch (error) {
      console.error("PayPal payment details retrieval failed:", error);
      throw new Error("Failed to get payment details");
    }
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
