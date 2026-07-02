import type { TelegramUser, WebAppInitData, ThemeParams } from './types';
import { createHash, Logger } from './utils';

// ==================== WebApp Access ====================
function getWebApp(): any {
  if (typeof window === 'undefined') return null;
  
  try {
    const tg = (window as any).Telegram?.WebApp;
    return tg || null;
  } catch {
    return null;
  }
}

// ==================== Detection Functions ====================
export function isTelegram(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).Telegram;
}

export function isMiniApp(): boolean {
  if (!isTelegram()) return false;
  const webApp = getWebApp();
  return !!(webApp && 'initData' in webApp && 'initDataUnsafe' in webApp);
}

export function platform(): string {
  const webApp = getWebApp();
  return webApp?.platform || 'unknown';
}

export function version(): string {
  const webApp = getWebApp();
  return webApp?.version || '0.0.0';
}

export function getInitData(): string {
  const webApp = getWebApp();
  return webApp?.initData || '';
}

// ==================== Init Data Parsing ====================
export function parseInitData(initData?: string): WebAppInitData {
  const data = initData || getInitData();
  if (!data) throw new Error('No init data available');

  const params = new URLSearchParams(data);
  const result: Record<string, any> = {};

  for (const [key, value] of params.entries()) {
    if (key === 'hash') {
      result.hash = value;
    } else if (key === 'auth_date') {
      result.auth_date = parseInt(value, 10);
    } else if (key === 'can_send_after') {
      result.can_send_after = parseInt(value, 10);
    } else if (key === 'user' || key === 'receiver' || key === 'chat') {
      try {
        result[key] = JSON.parse(value);
      } catch {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }

  return result as WebAppInitData;
}

// ==================== Validation ====================
export async function validateHash(token: string, initData?: string): Promise<boolean> {
  const data = initData || getInitData();
  if (!data) return false;

  const params = new URLSearchParams(data);
  const hash = params.get('hash');
  if (!hash) return false;
  
  params.delete('hash');

  const entries = Array.from(params.entries());
  entries.sort(([a], [b]) => a.localeCompare(b));
  
  const dataCheckString = entries
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = await createHash(token, 'SHA-256');
  const calculatedHash = await createHash(secretKey + dataCheckString, 'SHA-256');

  return calculatedHash === hash;
}

// ==================== User ====================
export function getUser(): TelegramUser | null {
  const webApp = getWebApp();
  
  if (webApp?.initDataUnsafe?.user) {
    return webApp.initDataUnsafe.user as TelegramUser;
  }
  
  try {
    const parsed = parseInitData();
    return parsed.user || null;
  } catch {
    return null;
  }
}

// ==================== Theme ====================
export function getThemeParams(): ThemeParams {
  const webApp = getWebApp();
  return webApp?.themeParams || {};
}

export function isDarkMode(): boolean {
  const webApp = getWebApp();
  return webApp?.colorScheme === 'dark';
}

// ==================== Viewport ====================
export function getViewport() {
  const webApp = getWebApp();
  
  if (typeof window === 'undefined') {
    return {
      height: 0,
      width: 0,
      isExpanded: false,
      safeArea: { top: 0, bottom: 0, left: 0, right: 0 },
      orientation: 'portrait' as const,
      isStateStable: false,
    };
  }

  return {
    height: webApp?.viewportHeight || window.innerHeight,
    width: webApp?.viewportStableHeight || window.innerWidth,
    isExpanded: webApp?.isExpanded || false,
    safeArea: {
      top: webApp?.contentSafeAreaInset?.top || 0,
      bottom: webApp?.contentSafeAreaInset?.bottom || 0,
      left: webApp?.contentSafeAreaInset?.left || 0,
      right: webApp?.contentSafeAreaInset?.right || 0,
    },
    orientation: (webApp?.orientation || 'portrait') as 'portrait' | 'landscape',
    isStateStable: webApp?.isViewportStable || false,
  };
}

// ==================== Logger ====================
export const logger = new Logger({ level: 'info' });