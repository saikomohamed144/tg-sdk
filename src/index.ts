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
// استخدام import() الديناميكي للـ default export لتجنب مشاكل الـ circular dependency
const tg = {
  get isTelegram() { return require('./core').isTelegram; },
  get isMiniApp() { return require('./core').isMiniApp; },
  get platform() { return require('./core').platform; },
  get version() { return require('./core').version; },
  get user() { return require('./core').getUser; },
  get theme() { return require('./core').getThemeParams; },
  get isDark() { return require('./core').isDarkMode; },
  get viewport() { return require('./core').getViewport; },
  
  ready: require('./mini-app').ready,
  expand: require('./mini-app').expand,
  close: require('./mini-app').close,
  sendData: require('./mini-app').sendData,
  openLink: require('./mini-app').openLink,
  openTelegramLink: require('./mini-app').openTelegramLink,
  showPopup: require('./mini-app').showPopup,
  showAlert: require('./mini-app').showAlert,
  showConfirm: require('./mini-app').showConfirm,
  
  get MainButton() { return require('./mini-app').MainButton; },
  get BackButton() { return require('./mini-app').BackButton; },
  get SettingsButton() { return require('./mini-app').SettingsButton; },
  get HapticFeedback() { return require('./mini-app').HapticFeedback; },
  get CloudStorage() { return require('./mini-app').CloudStorage; },
  get Clipboard() { return require('./mini-app').Clipboard; },
  get Biometric() { return require('./mini-app').Biometric; },
  
  getLocation: require('./mini-app').getLocation,
  scanQr: require('./mini-app').scanQr,
  onEvent: require('./mini-app').onEvent,
  offEvent: require('./mini-app').offEvent,
  onThemeChanged: require('./mini-app').onThemeChanged,

  markdown: require('./markdown').markdown,
  html: require('./markdown').html,
  inlineKeyboard: require('./keyboard').inlineKeyboard,
  replyKeyboard: require('./keyboard').replyKeyboard,
  removeKeyboard: require('./keyboard').removeKeyboard,
  forceReply: require('./keyboard').forceReply,

  get Bot() { return require('./bot').BotClient; },

  sleep: require('./utils').sleep,
  randomId: require('./utils').randomId,
  uuid: require('./utils').uuid,
};

export default tg;
