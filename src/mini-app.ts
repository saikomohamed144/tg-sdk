// Mini App API methods
import type { PopupParams } from './types';

// Helper to get Telegram WebApp object
function getWebApp(): any {
  if (typeof window === 'undefined') return {};
  
  try {
    const tg = (window as any).Telegram?.WebApp;
    return tg || {};
  } catch {
    return {};
  }
}

// Core Mini App functions
export function ready(): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.ready === 'function') {
    webApp.ready();
  }
}

export function expand(): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.expand === 'function') {
    webApp.expand();
  }
}

export function close(): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.close === 'function') {
    webApp.close();
  }
}

export function sendData(data: string): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.sendData === 'function') {
    webApp.sendData(data);
  }
}

export function openLink(url: string, options?: { try_instant_view?: boolean }): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.openLink === 'function') {
    webApp.openLink(url, options);
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
}

export function openTelegramLink(url: string): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.openTelegramLink === 'function') {
    webApp.openTelegramLink(url);
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
}

export async function requestWriteAccess(): Promise<boolean> {
  const webApp = getWebApp();
  if (webApp && typeof webApp.requestWriteAccess === 'function') {
    try {
      return await webApp.requestWriteAccess();
    } catch {
      return false;
    }
  }
  return false;
}

export async function requestContact(): Promise<boolean> {
  const webApp = getWebApp();
  if (webApp && typeof webApp.requestContact === 'function') {
    try {
      return await webApp.requestContact();
    } catch {
      return false;
    }
  }
  return false;
}

export function requestFullscreen(): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.requestFullscreen === 'function') {
    webApp.requestFullscreen();
  }
}

export function exitFullscreen(): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.exitFullscreen === 'function') {
    webApp.exitFullscreen();
  }
}

export function enableVerticalSwipes(): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.enableVerticalSwipes === 'function') {
    webApp.enableVerticalSwipes();
  }
}

export function disableVerticalSwipes(): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.disableVerticalSwipes === 'function') {
    webApp.disableVerticalSwipes();
  }
}

export function enableClosingConfirmation(): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.enableClosingConfirmation === 'function') {
    webApp.enableClosingConfirmation();
  }
}

export function disableClosingConfirmation(): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.disableClosingConfirmation === 'function') {
    webApp.disableClosingConfirmation();
  }
}

// Main Button
export const MainButton = {
  get _button() {
    return getWebApp()?.MainButton;
  },

  show(): void {
    this._button?.show?.();
  },

  hide(): void {
    this._button?.hide?.();
  },

  enable(): void {
    this._button?.enable?.();
  },

  disable(): void {
    this._button?.disable?.();
  },

  setText(text: string): void {
    if (this._button) {
      this._button.text = text;
    }
  },

  setColor(color: string): void {
    if (this._button) {
      this._button.color = color;
    }
  },

  setTextColor(color: string): void {
    if (this._button) {
      this._button.textColor = color;
    }
  },

  showProgress(leaveActive = false): void {
    this._button?.showProgress?.(leaveActive);
  },

  hideProgress(): void {
    this._button?.hideProgress?.();
  },

  onClick(callback: () => void): void {
    if (this._button) {
      this._button.onClick(callback);
    }
  },

  offClick(callback: () => void): void {
    if (this._button) {
      this._button.offClick(callback);
    }
  }
};

// Back Button
export const BackButton = {
  get _button() {
    return getWebApp()?.BackButton;
  },

  show(): void {
    this._button?.show?.();
  },

  hide(): void {
    this._button?.hide?.();
  },

  onClick(callback: () => void): void {
    if (this._button) {
      this._button.onClick(callback);
    }
  },

  offClick(callback: () => void): void {
    if (this._button) {
      this._button.offClick(callback);
    }
  }
};

// Settings Button
export const SettingsButton = {
  get _button() {
    return getWebApp()?.SettingsButton;
  },

  show(): void {
    this._button?.show?.();
  },

  hide(): void {
    this._button?.hide?.();
  },

  onClick(callback: () => void): void {
    if (this._button) {
      this._button.onClick(callback);
    }
  },

  offClick(callback: () => void): void {
    if (this._button) {
      this._button.offClick(callback);
    }
  }
};

// Popup functions
export function showPopup(params: PopupParams): Promise<string | null> {
  const webApp = getWebApp();
  
  return new Promise((resolve) => {
    if (webApp && typeof webApp.showPopup === 'function') {
      webApp.showPopup(params, (buttonId: string | null) => {
        resolve(buttonId);
      });
    } else {
      // Fallback for non-Telegram environments
      if (typeof window !== 'undefined') {
        window.alert(params.message);
      }
      resolve(null);
    }
  });
}

export function showAlert(message: string): Promise<void> {
  const webApp = getWebApp();
  
  return new Promise((resolve) => {
    if (webApp && typeof webApp.showAlert === 'function') {
      webApp.showAlert(message, () => {
        resolve();
      });
    } else {
      if (typeof window !== 'undefined') {
        window.alert(message);
      }
      resolve();
    }
  });
}

export function showConfirm(message: string): Promise<boolean> {
  const webApp = getWebApp();
  
  return new Promise((resolve) => {
    if (webApp && typeof webApp.showConfirm === 'function') {
      webApp.showConfirm(message, (confirmed: boolean) => {
        resolve(confirmed);
      });
    } else {
      if (typeof window !== 'undefined') {
        resolve(window.confirm(message));
      } else {
        resolve(false);
      }
    }
  });
}

// Haptic Feedback
export const HapticFeedback = {
  get _haptic() {
    return getWebApp()?.HapticFeedback;
  },

  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void {
    this._haptic?.impactOccurred?.(style);
  },

  notificationOccurred(type: 'error' | 'success' | 'warning'): void {
    this._haptic?.notificationOccurred?.(type);
  },

  selectionChanged(): void {
    this._haptic?.selectionChanged?.();
  }
};

// QR Scanner
export function scanQr(text?: string): Promise<string> {
  const webApp = getWebApp();
  
  return new Promise((resolve, reject) => {
    if (webApp && typeof webApp.showScanQrPopup === 'function') {
      webApp.showScanQrPopup(
        { text },
        (data: string) => {
          if (typeof webApp.closeScanQrPopup === 'function') {
            webApp.closeScanQrPopup();
          }
          resolve(data);
        }
      );
    } else {
      reject(new Error('QR scanner is not available in this environment'));
    }
  });
}

// Clipboard
export const Clipboard = {
  async copy(text: string): Promise<boolean> {
    const webApp = getWebApp();
    
    if (webApp && typeof webApp.writeTextToClipboard === 'function') {
      try {
        await webApp.writeTextToClipboard(text);
        return true;
      } catch {
        // Fallback to browser API
        if (typeof navigator !== 'undefined' && navigator?.clipboard) {
          try {
            await navigator.clipboard.writeText(text);
            return true;
          } catch {
            return false;
          }
        }
        return false;
      }
    }
    
    // Browser fallback
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        return false;
      }
    }
    
    return false;
  },

  async read(): Promise<string | null> {
    const webApp = getWebApp();
    
    if (webApp && typeof webApp.readTextFromClipboard === 'function') {
      try {
        return await webApp.readTextFromClipboard();
      } catch {
        return null;
      }
    }
    
    // Browser fallback
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        return await navigator.clipboard.readText();
      } catch {
        return null;
      }
    }
    
    return null;
  }
};

// Cloud Storage
export const CloudStorage = {
  async get(key: string): Promise<string | null> {
    const webApp = getWebApp();
    
    if (webApp?.CloudStorage && typeof webApp.CloudStorage.getItem === 'function') {
      try {
        return await webApp.CloudStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return null;
  },

  async set(key: string, value: string): Promise<boolean> {
    const webApp = getWebApp();
    
    if (webApp?.CloudStorage && typeof webApp.CloudStorage.setItem === 'function') {
      try {
        await webApp.CloudStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  },

  async remove(key: string): Promise<boolean> {
    const webApp = getWebApp();
    
    if (webApp?.CloudStorage && typeof webApp.CloudStorage.removeItem === 'function') {
      try {
        await webApp.CloudStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  },

  async getKeys(): Promise<string[]> {
    const webApp = getWebApp();
    
    if (webApp?.CloudStorage && typeof webApp.CloudStorage.getKeys === 'function') {
      try {
        return await webApp.CloudStorage.getKeys();
      } catch {
        return [];
      }
    }
    return [];
  },

  async clear(): Promise<boolean> {
    try {
      const keys = await this.getKeys();
      await Promise.all(keys.map(key => this.remove(key)));
      return true;
    } catch {
      return false;
    }
  }
};

// Biometric
export const Biometric = {
  async authenticate(reason?: string): Promise<boolean> {
    const webApp = getWebApp();
    
    if (webApp?.BiometricManager && typeof webApp.BiometricManager.authenticate === 'function') {
      try {
        return await webApp.BiometricManager.authenticate({ reason });
      } catch {
        return false;
      }
    }
    return false;
  },

  async requestAccess(reason?: string): Promise<boolean> {
    const webApp = getWebApp();
    
    if (webApp?.BiometricManager && typeof webApp.BiometricManager.requestAccess === 'function') {
      try {
        return await webApp.BiometricManager.requestAccess({ reason });
      } catch {
        return false;
      }
    }
    return false;
  }
};

// Location
export async function getLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number } | null> {
  const webApp = getWebApp();
  
  if (webApp?.LocationManager && typeof webApp.LocationManager.getLocation === 'function') {
    try {
      return await webApp.LocationManager.getLocation();
    } catch {
      return null;
    }
  }
  
  // Browser Geolocation API fallback
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        () => {
          resolve(null);
        }
      );
    });
  }
  
  return null;
}

// Event handlers
export function onEvent(event: string, callback: (...args: any[]) => void): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.onEvent === 'function') {
    webApp.onEvent(event, callback);
  }
}

export function offEvent(event: string, callback: (...args: any[]) => void): void {
  const webApp = getWebApp();
  if (webApp && typeof webApp.offEvent === 'function') {
    webApp.offEvent(event, callback);
  }
}

// Theme change listener
export function onThemeChanged(callback: () => void): void {
  onEvent('themeChanged', callback);
}

// Viewport change listener
export function onViewportChanged(callback: (viewport: { height: number; isStateStable: boolean }) => void): void {
  onEvent('viewportChanged', callback);
}

// Invoice closed listener
export function onInvoiceClosed(callback: (event: { url: string; status: string }) => void): void {
  onEvent('invoiceClosed', callback);
}