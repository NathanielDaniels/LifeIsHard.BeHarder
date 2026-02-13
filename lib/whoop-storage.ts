// ============================================
// WHOOP Token Storage
// Simple file-based storage for single-user setup
// Replace with database for multi-user scenarios
// ============================================

import { promises as fs } from 'fs';
import path from 'path';
import { WhoopTokens } from '@/types/whoop';

// Store tokens in a JSON file (gitignored)
const TOKEN_FILE = path.join(process.cwd(), '.whoop-tokens.json');

interface StoredData {
  tokens: WhoopTokens | null;
  userId: number | null;
}

const DEFAULT_DATA: StoredData = {
  tokens: null,
  userId: null,
};

async function readStorage(): Promise<StoredData> {
  try {
    const data = await fs.readFile(TOKEN_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return DEFAULT_DATA;
  }
}

async function writeStorage(data: StoredData): Promise<void> {
  await fs.writeFile(TOKEN_FILE, JSON.stringify(data, null, 2));
}

// ============================================
// Public API
// ============================================

export async function getStoredTokens(): Promise<WhoopTokens | null> {
  const data = await readStorage();
  return data.tokens;
}

export async function storeTokens(tokens: WhoopTokens, userId?: number): Promise<void> {
  const data = await readStorage();
  data.tokens = tokens;
  if (userId) {
    data.userId = userId;
  }
  await writeStorage(data);
}

export async function clearTokens(): Promise<void> {
  await writeStorage(DEFAULT_DATA);
}

export async function isAuthorized(): Promise<boolean> {
  const tokens = await getStoredTokens();
  return tokens !== null;
}

export async function getValidAccessToken(): Promise<string | null> {
  const { refreshAccessToken } = await import('./whoop-client');
  
  const tokens = await getStoredTokens();
  if (!tokens) {
    return null;
  }
  
  // Check if token is expired (with 5 minute buffer)
  const isExpired = Date.now() >= (tokens.expires_at - 5 * 60 * 1000);
  
  if (!isExpired) {
    return tokens.access_token;
  }
  
  // Token expired, try to refresh
  try {
    const newTokens = await refreshAccessToken(tokens.refresh_token);
    await storeTokens(newTokens);
    return newTokens.access_token;
  } catch (error) {
    console.error('Failed to refresh token, retrying once...', error);
    // Retry once after a brief delay (network blip, server restart, etc.)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newTokens = await refreshAccessToken(tokens.refresh_token);
      await storeTokens(newTokens);
      return newTokens.access_token;
    } catch (retryError) {
      console.error('Token refresh retry also failed:', retryError);
      // Don't clear tokens — the refresh token may still be valid
      // for a future request. Only explicit disconnect should clear tokens.
      return null;
    }
  }
}
