# Musarty - AI Creation Hub Architecture

A production-ready full-stack AI platform with integrated Shot Caller orchestration system, featuring 24+ AI models, secure vault management, and intelligent routing.

## 🎯 What Musarty Is

**The Universal AI Creation Platform** that unifies text, image, video, and music generation into one seamless experience. Built for creators who want access to the world's best AI models without the complexity.

## 🏗️ Tech Stack

- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server with Shot Caller orchestration system
- **AI Integration**: 24+ models across 5 providers (OpenAI, Groq, Anthropic, Gemini, Stability)
- **Security**: AES-256 vault system with automatic key rotation
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## 📁 Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components
│   ├── Index.tsx         # Image to code converter (legacy)
│   ├── NeonCity.tsx      # Multi-modal AI generation
│   ├── Providers.tsx     # AI Arena - model showcase
│   ├── Pricing.tsx       # Pricing and plans
│   ├── Checkout.tsx      # Payment processing
│   └── Settings.tsx      # User configuration
├── components/ui/        # Pre-built UI component library
├── hooks/                # Custom React hooks
├── App.tsx               # App entry point with SPA routing
└── global.css            # TailwindCSS 3 theming (fire orange theme)

server/                   # Express API backend
├── config/               # Configuration files
│   └── model-groups.ts   # AI model definitions and grouping
├── services/             # Core business logic
│   ├── shot-caller.ts    # Main orchestration system
│   ├── vault_musarty.ts  # Secure API key management
│   ├── ai-providers.ts   # Provider abstractions
│   ├── groq-provider.ts  # Groq integration
│   ├── openai-provider.ts# OpenAI integration
│   └── settings.ts       # User settings management
├── routes/               # API handlers
│   ├── shot-caller.ts    # Main AI generation routes
│   ├── checkout.ts       # Payment processing
│   ├── convert.ts        # Image to code (legacy)
│   └── settings.ts       # Settings API
└── index.ts              # Main server setup

shared/                   # Types used by both client & server
└── api.ts                # Shared interfaces and types
```

## 🎯 Key Features

### 🔥 Shot Caller System

The intelligent request orchestrator that:

- **Analyzes requests** and routes to optimal AI models
- **Manages billing** (BYOK unlimited vs pay-per-block)
- **Handles authentication** and rate limiting
- **Tracks usage** and provides analytics
- **Encrypts API keys** with military-grade security

### 🔐 Musarty Vault

Secure API key management system:

- **AES-256 encryption** for all stored keys
- **Automatic rotation** every 1000 characters
- **Zero logging** of raw API keys
- **Smart load balancing** across multiple keys
- **Cooling periods** to prevent API abuse

### 🎮 AI Model Groups

**Group 1: Fast Text & Daily Hustle (10 Models)**

- Unlimited BYOK for text generation
- Low-cost, high-speed models
- Perfect for daily workflows

**Group 2: Heavy Compute & Complex Reasoning (9 Models)**

- Always metered (regardless of BYOK)
- Premium models for complex tasks
- Advanced reasoning and analysis

**Specialty: Creative & Visual (5 Models)**

- Always metered, no free rides
- Image, video, and music generation
- Premium creative AI models

## 🛣️ SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` - Image to code converter (legacy)
- `client/pages/NeonCity.tsx` - Multi-modal AI generation hub
- `client/pages/Providers.tsx` - AI Arena showcasing all models
- `client/pages/Pricing.tsx` - Pricing plans and billing
- `client/pages/Checkout.tsx` - Payment processing
- `client/pages/Settings.tsx` - User configuration and API keys

Routes are defined in `client/App.tsx`:

```typescript
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/neon-city" element={<NeonCity />} />
  <Route path="/providers" element={<Providers />} />
  <Route path="/pricing" element={<Pricing />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/settings" element={<Settings />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 🎨 Styling System

- **Primary**: TailwindCSS 3 utility classes with custom fire theme
- **Theme**: Fire orange gradient palette (hsl(25 100% 60%))
- **UI components**: Pre-built library in `client/components/ui/`
- **Effects**: Glassmorphism, neon glows, and cyber aesthetics
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge`

```typescript
// Fire theme colors
--fire-orange: 25 100% 60%;
--fire-red: 15 100% 50%;
--fire-yellow: 35 100% 55%;
```

### 🔌 Shot Caller Integration

**Development**: Single port (8080) for both frontend/backend with intelligent routing

#### Main API Endpoints

- `POST /api/shot-caller/generate` - Main AI generation endpoint
- `GET /api/models` - List all 24 available models
- `GET /api/users/:id/usage` - User statistics and billing
- `POST /api/users/initialize` - New user setup
- `GET /api/vault/stats` - Vault monitoring (admin)

#### Legacy Endpoints (Maintained)

- `POST /api/generate` - Original Neon City generation
- `POST /api/convert` - Image to code conversion
- `GET /api/settings` - User settings management

### 📊 Shared Types

Import consistent types in both client and server:

```typescript
import { GenerationRequest, GenerationResponse } from "@shared/api";
```

Path aliases:

- `@shared/*` - Shared folder
- `@/*` - Client folder

## 🚀 Development Commands

```bash
npm run dev        # Start dev server (client + server)
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript validation
npm test          # Run Vitest tests
```

## 🎯 Adding New Features

### Add New AI Model

1. **Add to model groups** in `server/config/model-groups.ts`:

```typescript
export const GROUP1_MODELS: ModelInfo[] = [
  {
    id: "new-model-id",
    name: "New Model Name",
    provider: "provider-name",
    pricing: "$X.XX/M tokens",
    speed: "Lightning",
    quality: "Exceptional",
    category: "Category",
  },
  // ... existing models
];
```

2. **Implement provider service** in `server/services/new-provider.ts`:

```typescript
export async function callNewProvider(
  request: GenerationRequest,
  apiKey: string,
): Promise<string> {
  // Implementation
}
```

3. **Update Shot Caller** routing in `server/services/shot-caller.ts`

### Add New Generation Type

1. **Update request types** in `shared/api.ts`:

```typescript
export interface GenerationRequest {
  content_type?: "text" | "image" | "video" | "music" | "new-type";
}
```

2. **Add frontend interface** in appropriate page component
3. **Update billing logic** in Shot Caller

### Add New UI Route

1. Create component in `client/pages/NewPage.tsx`
2. Add route in `client/App.tsx`:

```typescript
<Route path="/new-page" element={<NewPage />} />
```

3. Update navigation in `client/components/Navigation.tsx`

## 🔐 Security Architecture

### API Key Management

- **User Keys**: Encrypted with AES-256 before database storage
- **Vault Keys**: Environment variables only, never in database
- **Transmission**: HTTPS only, never logged in plain text
- **Access**: Server-side decryption only

### Usage Tracking

Every generation logs:

- `user_id` - User identifier
- `model_id` - Model used
- `chars_used` - Characters processed
- `blocks_deducted` - Billing blocks consumed
- `key_source` - BYOK or vault
- `timestamp` - When it happened

## 🌟 Production Deployment

- **Standard**: `npm run build` + `npm start`
- **Docker**: Dockerfile included
- **Environment**: All secrets in environment variables
- **Database**: Ready for PostgreSQL/Redis integration
- **Monitoring**: Vault statistics and usage analytics

## 📈 Architecture Notes

- **Single-port development** with Vite + Express integration
- **TypeScript throughout** (client, server, shared)
- **Full hot reload** for rapid development
- **Production-ready** with comprehensive error handling
- **Scalable architecture** ready for enterprise features
- **Security-first** design with encrypted vault system
- **Multi-provider AI** integration with intelligent routing

The platform is built to scale from individual creators to enterprise teams, with a foundation that supports unlimited AI models and generation types.
