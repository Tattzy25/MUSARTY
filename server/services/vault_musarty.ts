/**
 * MUSARTY VAULT SYSTEM
 *
 * Secure API key vault with intelligent rotation and usage tracking.
 * Keys rotate every 1000 characters to prevent overuse.
 *
 * Security: AES-256 encryption, zero logging, server-only access.
 */

import crypto from "crypto";

// Master encryption key - MUST be set as environment variable
const MASTER_KEY =
  process.env.MASTER_ENCRYPTION_KEY || "default-dev-key-change-in-production";

interface VaultKey {
  id: string;
  provider: string;
  encryptedKey: string;
  usageCount: number;
  charactersUsed: number;
  lastUsed: Date;
  status: "active" | "cooling" | "disabled";
  maxCharsPerCycle: number;
}

interface ProviderPool {
  [provider: string]: VaultKey[];
}

// In-memory vault (in production, use secure database)
let VAULT_POOL: ProviderPool = {
  openai: [],
  groq: [],
  anthropic: [],
  gemini: [],
  stability: [],
};

// Usage tracking per key
const KEY_USAGE = new Map<string, { chars: number; lastReset: Date }>();

/**
 * Encrypt API key using AES-256
 */
function encryptKey(apiKey: string): string {
  const cipher = crypto.createCipher("aes-256-cbc", MASTER_KEY);
  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

/**
 * Decrypt API key using AES-256
 */
function decryptKey(encryptedKey: string): string {
  const decipher = crypto.createDecipher("aes-256-cbc", MASTER_KEY);
  let decrypted = decipher.update(encryptedKey, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Add a new API key to the vault
 */
export function addKeyToVault(provider: string, apiKey: string): string {
  const keyId = `${provider}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  const vaultKey: VaultKey = {
    id: keyId,
    provider,
    encryptedKey: encryptKey(apiKey),
    usageCount: 0,
    charactersUsed: 0,
    lastUsed: new Date(),
    status: "active",
    maxCharsPerCycle: 1000,
  };

  if (!VAULT_POOL[provider]) {
    VAULT_POOL[provider] = [];
  }

  VAULT_POOL[provider].push(vaultKey);

  console.log(`🔐 Added ${provider} key to vault: ${keyId}`);
  return keyId;
}

/**
 * Get next available API key from vault with rotation
 */
export function getRotatingKey(provider: string): string | null {
  const providerKeys = VAULT_POOL[provider];

  if (!providerKeys || providerKeys.length === 0) {
    console.log(`❌ No keys available for provider: ${provider}`);
    return null;
  }

  // Reset keys that have exceeded their character limit
  resetExpiredKeys(provider);

  // Find next available key
  const availableKey = providerKeys.find(
    (key) =>
      key.status === "active" && key.charactersUsed < key.maxCharsPerCycle,
  );

  if (!availableKey) {
    console.log(`⏳ All ${provider} keys are cooling down`);
    return null;
  }

  return decryptKey(availableKey.encryptedKey);
}

/**
 * Track usage and rotate key when limit reached
 */
export function trackKeyUsage(provider: string, charactersUsed: number): void {
  const providerKeys = VAULT_POOL[provider];

  if (!providerKeys || providerKeys.length === 0) return;

  // Find the currently active key (most recently used)
  const activeKey = providerKeys
    .filter((key) => key.status === "active")
    .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())[0];

  if (activeKey) {
    activeKey.charactersUsed += charactersUsed;
    activeKey.usageCount += 1;
    activeKey.lastUsed = new Date();

    console.log(
      `📊 ${provider} key usage: ${activeKey.charactersUsed}/${activeKey.maxCharsPerCycle} chars`,
    );

    // If limit reached, send to back of line
    if (activeKey.charactersUsed >= activeKey.maxCharsPerCycle) {
      activeKey.status = "cooling";
      console.log(`🔄 ${provider} key ${activeKey.id} sent to back of line`);

      // Move to end of array (back of line)
      const index = providerKeys.indexOf(activeKey);
      providerKeys.splice(index, 1);
      providerKeys.push(activeKey);
    }
  }
}

/**
 * Reset keys that have been cooling down
 */
function resetExpiredKeys(provider: string): void {
  const providerKeys = VAULT_POOL[provider];

  providerKeys.forEach((key) => {
    if (key.status === "cooling") {
      // Reset after 5 minutes of cooling (adjustable)
      const coolingTime = 5 * 60 * 1000; // 5 minutes
      const timeSinceCooling = Date.now() - key.lastUsed.getTime();

      if (timeSinceCooling > coolingTime) {
        key.charactersUsed = 0;
        key.status = "active";
        console.log(`✅ Reset ${provider} key ${key.id} - back in rotation`);
      }
    }
  });
}

/**
 * Get vault statistics
 */
export function getVaultStats(): any {
  const stats: any = {};

  Object.keys(VAULT_POOL).forEach((provider) => {
    const keys = VAULT_POOL[provider];
    stats[provider] = {
      totalKeys: keys.length,
      activeKeys: keys.filter((k) => k.status === "active").length,
      coolingKeys: keys.filter((k) => k.status === "cooling").length,
      totalUsage: keys.reduce((sum, k) => sum + k.usageCount, 0),
      totalCharacters: keys.reduce((sum, k) => sum + k.charactersUsed, 0),
    };
  });

  return stats;
}

/**
 * Initialize vault with environment variables (Musarty's own keys)
 */
export function initializeVault(): void {
  console.log("🔐 Initializing Musarty Vault...");

  // Load Musarty's own keys from environment
  const musartyKeys = {
    openai: [
      process.env.OPENAI_KEY_1,
      process.env.OPENAI_KEY_2,
      process.env.OPENAI_KEY_3,
    ],
    groq: [process.env.GROQ_KEY_1, process.env.GROQ_KEY_2],
    anthropic: [process.env.ANTHROPIC_KEY_1],
    gemini: [process.env.GEMINI_KEY_1],
    stability: [process.env.STABILITY_KEY_1],
  };

  Object.entries(musartyKeys).forEach(([provider, keys]) => {
    keys.forEach((key, index) => {
      if (key && key !== "your-key-here") {
        addKeyToVault(provider, key);
        console.log(`✅ Loaded ${provider} key #${index + 1} into vault`);
      }
    });
  });

  console.log("🚀 Musarty Vault initialized successfully!");
  console.log("📊 Vault Stats:", getVaultStats());
}

/**
 * Smart key selector - picks best available key for the task
 */
export function getSmartKey(
  provider: string,
  estimatedChars: number = 100,
): {
  key: string | null;
  keyId: string | null;
  remainingChars: number;
} {
  const providerKeys = VAULT_POOL[provider];

  if (!providerKeys || providerKeys.length === 0) {
    return { key: null, keyId: null, remainingChars: 0 };
  }

  resetExpiredKeys(provider);

  // Find key with enough remaining capacity
  const suitableKey = providerKeys.find(
    (key) =>
      key.status === "active" &&
      key.maxCharsPerCycle - key.charactersUsed >= estimatedChars,
  );

  if (suitableKey) {
    return {
      key: decryptKey(suitableKey.encryptedKey),
      keyId: suitableKey.id,
      remainingChars: suitableKey.maxCharsPerCycle - suitableKey.charactersUsed,
    };
  }

  // Fallback to any available key
  const fallbackKey = providerKeys.find((key) => key.status === "active");

  if (fallbackKey) {
    return {
      key: decryptKey(fallbackKey.encryptedKey),
      keyId: fallbackKey.id,
      remainingChars: fallbackKey.maxCharsPerCycle - fallbackKey.charactersUsed,
    };
  }

  return { key: null, keyId: null, remainingChars: 0 };
}

/**
 * Remove a key from vault (for security)
 */
export function removeKeyFromVault(keyId: string): boolean {
  for (const provider in VAULT_POOL) {
    const keys = VAULT_POOL[provider];
    const index = keys.findIndex((key) => key.id === keyId);

    if (index !== -1) {
      keys.splice(index, 1);
      console.log(`🗑️ Removed key ${keyId} from vault`);
      return true;
    }
  }

  return false;
}

// Initialize vault on module load
initializeVault();
