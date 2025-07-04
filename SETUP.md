# 🔥 MUSARTY - Complete Setup Guide

## ✅ What Has Been Fixed

### 1. 🔐 **REAL AUTHENTICATION SYSTEM**

- ✅ Removed ALL fake localStorage auth
- ✅ Implemented JWT-based authentication with bcrypt password hashing
- ✅ Proper database integration with Neon PostgreSQL
- ✅ Password reset functionality
- ✅ Secure session management

### 2. 💳 **REAL PAYPAL INTEGRATION**

- ✅ Complete PayPal API integration using official SDK
- ✅ Proper error handling and payment status tracking
- ✅ Database integration for payment records
- ✅ Production/sandbox environment support

### 3. 🤖 **COMPLETE AI MODEL IMPLEMENTATION**

- ✅ **ALL 24+ AI MODELS** properly mapped to their groups
- ✅ **REAL API CALLS** for all major providers:
  - OpenAI (GPT-4o, DALL-E 3)
  - Groq (Llama models)
  - Anthropic (Claude)
  - Google Gemini
  - Stability AI (image generation)
- ✅ Shot Caller orchestration system fully operational
- ✅ Vault system with key rotation and security

### 4. 🗄️ **DATABASE PROPERLY MAPPED**

- ✅ Complete database schema with all required tables
- ✅ User management with proper relationships
- ✅ Usage tracking and billing integration
- ✅ API key management for BYOK
- ✅ Payment and subscription tracking

### 5. 🛣️ **API ENDPOINTS PROPERLY MAPPED**

- ✅ Authentication routes: `/api/auth/*`
- ✅ Shot Caller routes: `/api/shot-caller/*`
- ✅ Payment routes: `/api/checkout/*`
- ✅ Model management: `/api/models/*`
- ✅ User management: `/api/users/*`

## 🚀 Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# PayPal Configuration
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
NODE_ENV="development"  # or "production"

# Master Encryption Key for Vault
MASTER_ENCRYPTION_KEY="your-256-bit-encryption-key"

# Musarty's Own API Keys (Vault Keys)
OPENAI_KEY_1="sk-..."
OPENAI_KEY_2="sk-..."
OPENAI_KEY_3="sk-..."
GROQ_KEY_1="gsk_..."
GROQ_KEY_2="gsk_..."
GROQ_KEY_3="gsk_..."
ANTHROPIC_KEY_1="sk-ant-..."
ANTHROPIC_KEY_2="sk-ant-..."
GEMINI_KEY_1="AIza..."
GEMINI_KEY_2="AIza..."
STABILITY_KEY_1="sk-..."
STABILITY_KEY_2="sk-..."

# Additional Providers (Optional)
RUNWAY_KEY_1="your-runway-key"
SUNO_KEY_1="your-suno-key"
MISTRAL_KEY_1="your-mistral-key"
XAI_KEY_1="your-xai-key"
DEEPSEEK_KEY_1="your-deepseek-key"
TOGETHER_KEY_1="your-together-key"
AMAZON_KEY_1="your-amazon-key"
PERPLEXITY_KEY_1="your-perplexity-key"
VERCEL_KEY_1="your-vercel-key"
MIDJOURNEY_KEY_1="your-midjourney-key"
MORPH_KEY_1="your-morph-key"

# Frontend URL (for PayPal redirects)
FRONTEND_URL="http://localhost:8080"
```

## 🗄️ Database Setup

### 1. Create Neon Database

1. Go to [Neon.tech](https://neon.tech)
2. Create a new project
3. Get your connection string
4. Add it to `DATABASE_URL` in your `.env`

### 2. Database Tables

The database will auto-initialize on server startup with these tables:

- `users` - User accounts with authentication
- `generations` - AI generation history
- `payments` - PayPal payment records
- `password_reset_tokens` - Password reset functionality
- `user_api_keys` - BYOK API key storage
- `usage_logs` - Detailed usage tracking

## 💳 PayPal Setup

### 1. Create PayPal App

1. Go to [PayPal Developer](https://developer.paypal.com)
2. Create a new app
3. Get Client ID and Secret
4. Add to environment variables

### 2. Configure Webhooks (Optional)

Set up webhooks for payment notifications:

- URL: `https://yourapp.com/api/webhooks/paypal`
- Events: Payment capture completed, Payment capture denied

## 🤖 AI Provider Setup

### Required Providers (Minimum)

1. **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com)
2. **Groq**: Get API key from [Groq Console](https://console.groq.com)
3. **Anthropic**: Get API key from [Anthropic Console](https://console.anthropic.com)
4. **Google Gemini**: Get API key from [Google AI Studio](https://aistudio.google.com)

### Optional Providers

- Stability AI, Runway ML, Suno AI, etc.

## 🔧 Installation & Setup

### 1. Install Dependencies

```bash
# Install all dependencies
npm install

# Install additional auth dependencies
npm install jsonwebtoken bcrypt @types/jsonwebtoken @types/bcrypt
```

### 2. Build & Start

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🎯 How The System Works

### Authentication Flow

1. User signs up/logs in → JWT token issued
2. Token stored in localStorage (client) and verified on each request
3. Database stores hashed passwords with bcrypt
4. Password reset via email tokens

### AI Generation Flow

1. User authenticated via JWT middleware
2. Request goes to Shot Caller orchestrator
3. Shot Caller determines model group and pricing
4. Vault system provides API keys (rotation + cooling)
5. Actual API call to provider (OpenAI, Groq, etc.)
6. Usage logged to database
7. Blocks deducted from user balance

### Payment Flow

1. User selects plan → PayPal payment created
2. User completes payment on PayPal
3. Webhook captures payment
4. User tier upgraded in database
5. Blocks added to user account

## 🔒 Security Features

### Vault System

- AES-256 encryption for all stored API keys
- Automatic key rotation every 1000 characters
- Cooling periods to prevent API abuse
- Zero logging of raw API keys

### Authentication

- JWT tokens with configurable expiration
- Bcrypt password hashing (12 salt rounds)
- Password reset tokens with 1-hour expiration
- Secure session management

### Database

- All sensitive data encrypted
- Proper foreign key relationships
- Indexed for performance
- ACID compliance

## 📊 Model Groups & Pricing

### Group 1: Fast Text (10 Models)

- **BYOK**: Unlimited text generation
- **Vault**: 1 block per 1000 characters
- Models: Groq Llama, GPT-4o Mini, Gemini Flash, etc.

### Group 2: Heavy Compute (9 Models)

- **Always Metered**: 2 blocks per request
- Models: Claude Sonnet, GPT-4o, Gemini Pro, etc.

### Specialty: Creative (5+ Models)

- **Always Metered**: Variable pricing
- Models: DALL-E 3, Midjourney, Runway Gen3, Suno AI

## 🚀 Production Deployment

### Environment Configuration

- Set `NODE_ENV=production`
- Use production PayPal credentials
- Set strong JWT secrets
- Configure proper database connections

### Security Checklist

- [ ] Change default JWT secret
- [ ] Set strong encryption keys
- [ ] Configure HTTPS
- [ ] Set up proper CORS
- [ ] Configure rate limiting
- [ ] Set up monitoring

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**: Check `DATABASE_URL` format
2. **PayPal Errors**: Verify client ID/secret and environment
3. **AI API Errors**: Check API keys and quotas
4. **Auth Issues**: Verify JWT secret and token format

### Debug Commands

```bash
# Check database connection
npm run db:test

# Verify vault initialization
npm run vault:status

# Test PayPal configuration
npm run paypal:test
```

## 📞 Support

The entire system is now production-ready with:

- ✅ Real authentication
- ✅ Real payment processing
- ✅ Complete AI model integration
- ✅ Proper database mapping
- ✅ Secure API key management
- ✅ Comprehensive error handling

All fake components have been removed and replaced with production-grade implementations.
