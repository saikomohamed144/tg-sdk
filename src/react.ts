import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getUser,
  isDarkMode,
  getThemeParams,
  getViewport,
  isTelegram,
  isMiniApp,
  platform,
  version,
} from './core';
import {
  MainButton,
  BackButton,
  SettingsButton,
  onEvent,
  offEvent,
  showPopup,
  showAlert,
  showConfirm,
  HapticFeedback,
  CloudStorage,
  Clipboard,
} from './mini-app';
import type { TelegramUser, ThemeParams, PopupParams } from './types';

// ==================== useTelegram ====================
export function useTelegram() {
  const [webApp, setWebApp] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        setWebApp(tg);
      }
    }
  }, []);

  return {
    webApp,
    isTelegram: isTelegram(),
    isMiniApp: isMiniApp(),
    platform: platform(),
    version: version(),
  };
}

// ==================== useTelegramUser ====================
export function useTelegramUser(): TelegramUser | null {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Get user on mount
    setUser(getUser());

    // Listen for viewport changes (user might update)
    const handler = () => setUser(getUser());
    onEvent('viewportChanged', handler);
    return () => offEvent('viewportChanged', handler);
  }, []);

  return user;
}

// ==================== useTelegramTheme ====================
export function useTelegramTheme() {
  const [theme, setTheme] = useState<{
    params: ThemeParams;
    isDark: boolean;
  }>({
    params: getThemeParams(),
    isDark: isDarkMode(),
  });

  useEffect(() => {
    const handler = () => {
      setTheme({
        params: getThemeParams(),
        isDark: isDarkMode(),
      });
    };

    onEvent('themeChanged', handler);
    return () => offEvent('themeChanged', handler);
  }, []);

  return theme;
}

// ==================== useTelegramMainButton ====================
export function useTelegramMainButton() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(true);
  const [text, setText] = useState('');
  const [color, setColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [progress, setProgress] = useState(false);
  const onClickRef = useRef<(() => void) | null>(null);

  const show = useCallback(() => {
    MainButton.show();
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    MainButton.hide();
    setVisible(false);
  }, []);

  const enable = useCallback(() => {
    MainButton.enable();
    setActive(true);
  }, []);

  const disable = useCallback(() => {
    MainButton.disable();
    setActive(false);
  }, []);

  const updateText = useCallback((newText: string) => {
    MainButton.setText(newText);
    setText(newText);
  }, []);

  const updateColor = useCallback((newColor: string) => {
    MainButton.setColor(newColor);
    setColor(newColor);
  }, []);

  const updateTextColor = useCallback((newColor: string) => {
    MainButton.setTextColor(newColor);
    setTextColor(newColor);
  }, []);

  const showProgress = useCallback((leaveActive = false) => {
    MainButton.showProgress(leaveActive);
    setProgress(true);
  }, []);

  const hideProgress = useCallback(() => {
    MainButton.hideProgress();
    setProgress(false);
  }, []);

  const onClick = useCallback((callback: () => void) => {
    onClickRef.current = callback;
    MainButton.onClick(callback);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (onClickRef.current) {
        MainButton.offClick(onClickRef.current);
      }
    };
  }, []);

  return {
    visible,
    active,
    text,
    color,
    textColor,
    progress,
    show,
    hide,
    enable,
    disable,
    setText: updateText,
    setColor: updateColor,
    setTextColor: updateTextColor,
    showProgress,
    hideProgress,
    onClick,
  };
}

// ==================== useTelegramBackButton ====================
export function useTelegramBackButton() {
  const [visible, setVisible] = useState(false);
  const onClickRef = useRef<(() => void) | null>(null);

  const show = useCallback(() => {
    BackButton.show();
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    BackButton.hide();
    setVisible(false);
  }, []);

  const onClick = useCallback((callback: () => void) => {
    onClickRef.current = callback;
    BackButton.onClick(callback);
  }, []);

  useEffect(() => {
    return () => {
      if (onClickRef.current) {
        BackButton.offClick(onClickRef.current);
      }
    };
  }, []);

  return { visible, show, hide, onClick };
}

// ==================== useTelegramSettingsButton ====================
export function useTelegramSettingsButton() {
  const [visible, setVisible] = useState(false);
  const onClickRef = useRef<(() => void) | null>(null);

  const show = useCallback(() => {
    SettingsButton.show();
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    SettingsButton.hide();
    setVisible(false);
  }, []);

  const onClick = useCallback((callback: () => void) => {
    onClickRef.current = callback;
    SettingsButton.onClick(callback);
  }, []);

  useEffect(() => {
    return () => {
      if (onClickRef.current) {
        SettingsButton.offClick(onClickRef.current);
      }
    };
  }, []);

  return { visible, show, hide, onClick };
}

// ==================== useTelegramViewport ====================
export function useTelegramViewport() {
  const [viewport, setViewport] = useState(getViewport());

  useEffect(() => {
    const handler = () => setViewport(getViewport());
    onEvent('viewportChanged', handler);
    return () => offEvent('viewportChanged', handler);
  }, []);

  return viewport;
}

// ==================== useTelegramPopup ====================
export function useTelegramPopup() {
  const show = useCallback(async (params: PopupParams): Promise<string | null> => {
    return showPopup(params);
  }, []);

  const alert = useCallback(async (message: string): Promise<void> => {
    return showAlert(message);
  }, []);

  const confirm = useCallback(async (message: string): Promise<boolean> => {
    return showConfirm(message);
  }, []);

  return { show, alert, confirm };
}

// ==================== useTelegramHapticFeedback ====================
export function useTelegramHapticFeedback() {
  const impactOccurred = useCallback(
    (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
      HapticFeedback.impactOccurred(style);
    },
    []
  );

  const notificationOccurred = useCallback(
    (type: 'error' | 'success' | 'warning') => {
      HapticFeedback.notificationOccurred(type);
    },
    []
  );

  const selectionChanged = useCallback(() => {
    HapticFeedback.selectionChanged();
  }, []);

  return { impactOccurred, notificationOccurred, selectionChanged };
}

// ==================== useTelegramCloudStorage ====================
export function useTelegramCloudStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const get = useCallback(async (key: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      return await CloudStorage.get(key);
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const set = useCallback(async (key: string, value: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await CloudStorage.set(key, value);
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (key: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await CloudStorage.remove(key);
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { get, set, remove, loading, error };
}

// ==================== useTelegramClipboard ====================
export function useTelegramClipboard() {
  const copy = useCallback(async (text: string): Promise<boolean> => {
    return Clipboard.copy(text);
  }, []);

  const read = useCallback(async (): Promise<string | null> => {
    return Clipboard.read();
  }, []);

  return { copy, read };
}

// ==================== useTelegramEvent ====================
export function useTelegramEvent(
  event: string,
  callback: (...args: any[]) => void
) {
  useEffect(() => {
    onEvent(event, callback);
    return () => offEvent(event, callback);
  }, [event, callback]);
}

// ==================== useTelegramInvoice ====================
export function useTelegramInvoice() {
  useEffect(() => {
    const handler = (event: { url: string; status: string }) => {
      console.log('Invoice closed:', event);
    };
    onEvent('invoiceClosed', handler);
    return () => offEvent('invoiceClosed', handler);
  }, []);
}