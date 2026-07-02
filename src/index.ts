// ==================== Type Exports ====================
export type * from './types';

// ==================== Core Exports ====================
export {
  isTelegram,
  isMiniApp,
  platform,
  version,
  getInitData,
  parseInitData,
  validateHash,
  getUser,
  getThemeParams,
  isDarkMode,
  getViewport,
  logger,
} from './core';

// ==================== Mini App Exports ====================
export {
  ready,
  expand,
  close,
  sendData,
  openLink,
  openTelegramLink,
  requestWriteAccess,
  requestContact,
  requestFullscreen,
  exitFullscreen,
  enableVerticalSwipes,
  disableVerticalSwipes,
  enableClosingConfirmation,
  disableClosingConfirmation,
  MainButton,
  BackButton,
  SettingsButton,
  showPopup,
  showAlert,
  showConfirm,
  HapticFeedback,
  scanQr,
  Clipboard,
  CloudStorage,
  Biometric,
  getLocation,
  onEvent,
  offEvent,
  onThemeChanged,
  onViewportChanged,
  onInvoiceClosed,
} from './mini-app';

// ==================== Bot Exports ====================
export { BotClient } from './bot';

// ==================== Keyboard Exports ====================
export {
  InlineKeyboardBuilder,
  ReplyKeyboardBuilder,
  inlineKeyboard,
  replyKeyboard,
  removeKeyboard,
  forceReply,
  createInlineKeyboard,
} from './keyboard';

// ==================== Markdown & HTML Exports ====================
export {
  MarkdownBuilder,
  HTMLBuilder,
  markdown,
  html,
  ParseMode,
} from './markdown';

// ==================== Middleware Exports ====================
export {
  MiddlewareEngine,
  Router,
  Context,
  SessionManager,
  PluginSystem,
} from './middleware';

// ==================== Utility Exports ====================
export {
  sleep,
  debounce,
  throttle,
  randomId,
  uuid,
  deepMerge,
  withRetry,
  fetchWithTimeout,
  fetchJSON,
  createHash,
  createHmac,
  createHmacAsync,
  validateRequired,
  validateType,
  AsyncQueue,
  RateLimiter,
  MemoryCache,
  Logger,
  Scheduler,
  EventEmitter,
  buildFormData,
} from './utils';

// ==================== Default Export ====================
const tg = {
  // Core
  isTelegram: () => require('./core').isTelegram(),
  isMiniApp: () => require('./core').isMiniApp(),
  platform: () => require('./core').platform(),
  version: () => require('./core').version(),
  user: () => require('./core').getUser(),
  theme: () => require('./core').getThemeParams(),
  isDark: () => require('./core').isDarkMode(),
  viewport: () => require('./core').getViewport(),

  // Mini App
  ready: require('./mini-app').ready,
  expand: require('./mini-app').expand,
  close: require('./mini-app').close,
  sendData: require('./mini-app').sendData,
  openLink: require('./mini-app').openLink,
  openTelegramLink: require('./mini-app').openTelegramLink,
  showPopup: require('./mini-app').showPopup,
  showAlert: require('./mini-app').showAlert,
  showConfirm: require('./mini-app').showConfirm,
  MainButton: require('./mini-app').MainButton,
  BackButton: require('./mini-app').BackButton,
  SettingsButton: require('./mini-app').SettingsButton,
  HapticFeedback: require('./mini-app').HapticFeedback,
  CloudStorage: require('./mini-app').CloudStorage,
  Clipboard: require('./mini-app').Clipboard,
  Biometric: require('./mini-app').Biometric,
  getLocation: require('./mini-app').getLocation,
  scanQr: require('./mini-app').scanQr,
  onEvent: require('./mini-app').onEvent,
  offEvent: require('./mini-app').offEvent,
  onThemeChanged: require('./mini-app').onThemeChanged,

  // Builders
  markdown: require('./markdown').markdown,
  html: require('./html').html,
  inlineKeyboard: require('./keyboard').inlineKeyboard,
  replyKeyboard: require('./keyboard').replyKeyboard,
  removeKeyboard: require('./keyboard').removeKeyboard,
  forceReply: require('./keyboard').forceReply,

  // Bot
  Bot: require('./bot').BotClient,

  // Utilities
  sleep: require('./utils').sleep,
  randomId: require('./utils').randomId,
  uuid: require('./utils').uuid,
};

export default tg;