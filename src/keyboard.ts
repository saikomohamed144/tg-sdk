import type {
  InlineKeyboardMarkup, InlineKeyboardButton,
  ReplyKeyboardMarkup, KeyboardButton,
  ReplyKeyboardRemove, ForceReply,
  LoginUrl, WebAppInfo, KeyboardButtonPollType,
  KeyboardButtonRequestUsers, KeyboardButtonRequestChat,
  SwitchInlineQueryChosenChat
} from './types';

// ==================== Inline Keyboard Builder ====================
export class InlineKeyboardBuilder {
  private keyboard: InlineKeyboardButton[][] = [[]];
  private currentRow: InlineKeyboardButton[] = [];

  constructor() {
    this.keyboard = [[]];
    this.currentRow = this.keyboard[0];
  }

  /**
   * Add a button with text and callback_data
   */
  text(text: string, callbackData?: string): this {
    this.currentRow.push({
      text,
      callback_data: callbackData || text
    });
    return this;
  }

  /**
   * Add a URL button
   */
  url(text: string, url: string): this {
    this.currentRow.push({ text, url });
    return this;
  }

  /**
   * Add a WebApp button
   */
  webApp(text: string, url: string): this {
    this.currentRow.push({
      text,
      web_app: { url }
    });
    return this;
  }

  /**
   * Add a login button
   */
  login(text: string, loginUrl: string | LoginUrl): this {
    const login_url = typeof loginUrl === 'string'
      ? { url: loginUrl }
      : loginUrl;
    this.currentRow.push({ text, login_url });
    return this;
  }

  /**
   * Add a switch inline query button
   */
  switchInline(text: string, query = ''): this {
    this.currentRow.push({
      text,
      switch_inline_query: query
    });
    return this;
  }

  /**
   * Add a switch inline query in current chat button
   */
  switchInlineCurrentChat(text: string, query = ''): this {
    this.currentRow.push({
      text,
      switch_inline_query_current_chat: query
    });
    return this;
  }

  /**
   * Add a switch inline query chosen chat button
   */
  switchInlineChosenChat(
    text: string,
    options: SwitchInlineQueryChosenChat = {}
  ): this {
    this.currentRow.push({
      text,
      switch_inline_query_chosen_chat: options
    });
    return this;
  }

  /**
   * Add a pay button
   */
  pay(text: string): this {
    this.currentRow.push({ text, pay: true });
    return this;
  }

  /**
   * Add a callback game button
   */
  game(text: string): this {
    this.currentRow.push({ text, callback_game: {} });
    return this;
  }

  /**
   * Add a raw button object
   */
  add(button: InlineKeyboardButton): this {
    this.currentRow.push(button);
    return this;
  }

  /**
   * Start a new row
   */
  row(): this {
    const newRow: InlineKeyboardButton[] = [];
    this.keyboard.push(newRow);
    this.currentRow = newRow;
    return this;
  }

  /**
   * Build the inline keyboard markup
   */
  build(): InlineKeyboardMarkup {
    return {
      inline_keyboard: this.keyboard.filter(row => row.length > 0)
    };
  }
}

// ==================== Reply Keyboard Builder ====================
export class ReplyKeyboardBuilder {
  private keyboard: KeyboardButton[][] = [[]];
  private currentRow: KeyboardButton[] = [];
  private options: {
    resize_keyboard?: boolean;
    one_time_keyboard?: boolean;
    is_persistent?: boolean;
    input_field_placeholder?: string;
    selective?: boolean;
  } = {};

  constructor() {
    this.keyboard = [[]];
    this.currentRow = this.keyboard[0];
  }

  /**
   * Add a simple text button
   */
  text(text: string): this {
    this.currentRow.push({ text });
    return this;
  }

  /**
   * Add a contact request button
   */
  requestContact(text: string): this {
    this.currentRow.push({
      text,
      request_contact: true
    });
    return this;
  }

  /**
   * Add a location request button
   */
  requestLocation(text: string): this {
    this.currentRow.push({
      text,
      request_location: true
    });
    return this;
  }

  /**
   * Add a poll request button
   */
  requestPoll(text: string, type?: 'quiz' | 'regular'): this {
    const requestPoll: KeyboardButtonPollType = {};
    if (type) requestPoll.type = type;
    this.currentRow.push({
      text,
      request_poll: requestPoll
    });
    return this;
  }

  /**
   * Add a WebApp button
   */
  webApp(text: string, url: string): this {
    this.currentRow.push({
      text,
      web_app: { url }
    });
    return this;
  }

  /**
   * Add a request users button
   */
  requestUsers(text: string, options: KeyboardButtonRequestUsers): this {
    this.currentRow.push({
      text,
      request_users: options
    });
    return this;
  }

  /**
   * Add a request chat button
   */
  requestChat(text: string, options: KeyboardButtonRequestChat): this {
    this.currentRow.push({
      text,
      request_chat: options
    });
    return this;
  }

  /**
   * Start a new row
   */
  row(): this {
    const newRow: KeyboardButton[] = [];
    this.keyboard.push(newRow);
    this.currentRow = newRow;
    return this;
  }

  /**
   * Resize keyboard to fit buttons
   */
  resize(value = true): this {
    this.options.resize_keyboard = value;
    return this;
  }

  /**
   * Hide keyboard after use
   */
  oneTime(value = true): this {
    this.options.one_time_keyboard = value;
    return this;
  }

  /**
   * Make keyboard persistent
   */
  persistent(value = true): this {
    this.options.is_persistent = value;
    return this;
  }

  /**
   * Set input field placeholder
   */
  placeholder(text: string): this {
    this.options.input_field_placeholder = text;
    return this;
  }

  /**
   * Show keyboard only to specific users
   */
  selective(value = true): this {
    this.options.selective = value;
    return this;
  }

  /**
   * Build the reply keyboard markup
   */
  build(): ReplyKeyboardMarkup {
    return {
      keyboard: this.keyboard.filter(row => row.length > 0),
      ...this.options
    };
  }
}

// ==================== Helper Functions ====================

/**
 * Create a ReplyKeyboardRemove markup
 */
export function removeKeyboard(selective = false): ReplyKeyboardRemove {
  return {
    remove_keyboard: true,
    selective
  };
}

/**
 * Create a ForceReply markup
 */
export function forceReply(placeholder?: string, selective = false): ForceReply {
  return {
    force_reply: true,
    input_field_placeholder: placeholder,
    selective
  };
}

/**
 * Create a new InlineKeyboardBuilder instance
 */
export function inlineKeyboard(): InlineKeyboardBuilder {
  return new InlineKeyboardBuilder();
}

/**
 * Create a new ReplyKeyboardBuilder instance
 */
export function replyKeyboard(): ReplyKeyboardBuilder {
  return new ReplyKeyboardBuilder();
}

/**
 * Quick inline keyboard creation helper
 * 
 * @example
 * ```ts
 * const keyboard = inlineKeyboard()
 *   .text('Button 1', 'data1')
 *   .row()
 *   .url('Website', 'https://example.com')
 *   .build();
 * ```
 */
export function createInlineKeyboard(
  rows: (InlineKeyboardButton[] | InlineKeyboardButton)[]
): InlineKeyboardMarkup {
  const builder = new InlineKeyboardBuilder();
  
  for (const row of rows) {
    if (Array.isArray(row)) {
      for (const button of row) {
        builder.add(button);
      }
    } else {
      builder.add(row);
      builder.row();
    }
  }
  
  return builder.build();
}

/**
 * Quick reply keyboard creation helper
 * 
 * @example
 * ```ts
 * const keyboard = replyKeyboard()
 *   .text('Option 1')
 *   .text('Option 2')
 *   .row()
 *   .text('Option 3')
 *   .resize()
 *   .build();
 * ```
 */