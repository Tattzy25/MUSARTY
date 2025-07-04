/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Convert API types
 */
export interface ConvertRequest {
  files: Array<{
    data: string; // base64 data
    name: string;
    type: string;
  }>;
  settings?: {
    aiModel?: string;
    codeStyle?: string;
    generateTypeScript?: boolean;
    includeTailwind?: boolean;
    responsiveDesign?: boolean;
    accessibilityFeatures?: boolean;
    performanceOptimization?: boolean;
    includeComments?: boolean;
    qualityLevel?: number;
  };
}

export interface ConvertResponse {
  success: boolean;
  data?: {
    results: Array<{
      react: string;
      html: string;
      css: string;
      fileName: string;
      originalFileName: string;
    }>;
    processingTime: number;
    totalFiles: number;
  };
  error?: string;
}

/**
 * Settings API types
 */
export interface SettingsRequest {
  groqApiKey?: string;
  v0ApiKey?: string;
  openaiApiKey?: string;
  geminiApiKey?: string;
  aiProvider?: string;
  aiModel?: string;
  codeStyle?: string;
  optimization?: string;
  includeComments?: boolean;
  generateTypeScript?: boolean;
  includeTailwind?: boolean;
  responsiveDesign?: boolean;
  accessibilityFeatures?: boolean;
  performanceOptimization?: boolean;
  notifications?: boolean;
  qualityLevel?: number;
  processingSpeed?: number;
}

export interface SettingsResponse {
  success: boolean;
  data?: SettingsRequest & {
    groqApiKey?: string; // will be "***configured***" if set
    v0ApiKey?: string; // will be "***configured***" if set
    openaiApiKey?: string; // will be "***configured***" if set
    geminiApiKey?: string; // will be "***configured***" if set
    availableProviders?: any;
  };
  error?: string;
}

export interface ApiKeyTestRequest {
  provider: string;
  apiKey: string;
}

export interface ApiKeyTestResponse {
  success: boolean;
  valid?: boolean;
  error?: string;
}

/**
 * Pricing and Checkout API types
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval?: "month" | "year" | "one-time";
  features: string[];
  popular?: boolean;
}

export interface CheckoutRequest {
  planId: string;
  paymentMethod: "card" | "paypal";
  customerInfo: {
    email: string;
    name?: string;
    country?: string;
  };
  paymentInfo?: {
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvc?: string;
  };
}

export interface CheckoutResponse {
  success: boolean;
  data?: {
    sessionId: string;
    paymentUrl?: string;
    status: "pending" | "processing" | "completed" | "failed";
    orderId: string;
  };
  error?: string;
}

export interface UserSubscription {
  id: string;
  planId: string;
  status: "active" | "inactive" | "cancelled" | "trial";
  startDate: string;
  endDate?: string;
  remainingGenerations?: number;
  features: string[];
  billingHistory?: Array<{
    date: string;
    amount: number;
    status: string;
    description: string;
  }>;
}
