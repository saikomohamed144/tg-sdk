import type {
  MiddlewareFn, MiddlewareContext, SessionStore,
  SessionData, EventType, TelegramUpdate
} from './types';
import { EventEmitter } from './utils';

// ==================== Middleware Engine ====================
export class MiddlewareEngine {
  private middlewares: MiddlewareFn[] = [];

  use(...fns: MiddlewareFn[]): this {
    this.middlewares.push(...fns);
    return this;
  }

  compose(): (ctx: MiddlewareContext) => Promise<void> {
    const middlewares = [...this.middlewares];

    return async (ctx: MiddlewareContext): Promise<void> => {
      let index = -1;

      const dispatch = async (i: number): Promise<void> => {
        if (i <= index) throw new Error('next() called multiple times');
        index = i;

        const fn = middlewares[i];
        if (!fn) return;

        await fn(ctx, () => dispatch(i + 1));
      };

      await dispatch(0);
    };
  }

  async run(ctx: MiddlewareContext): Promise<void> {
    const composed = this.compose();
    await composed(ctx);
  }
}

// ==================== Router ====================
export class Router {
  private handlers = new Map<string, MiddlewareFn[]>();

  /**
   * Handle bot commands (e.g., /start, /help)
   */
  command(command: string, ...handlers: MiddlewareFn[]): this {
    this.handlers.set(`command:${command.toLowerCase()}`, handlers);
    return this;
  }

  /**
   * Handle text messages matching a string or regex
   */
  hears(pattern: string | RegExp, ...handlers: MiddlewareFn[]): this {
    const key = pattern instanceof RegExp
      ? `regex:${pattern.source}`
      : `hears:${pattern.toLowerCase()}`;
    this.handlers.set(key, handlers);
    return this;
  }

  /**
   * Handle callback query actions
   */
  action(action: string | RegExp, ...handlers: MiddlewareFn[]): this {
    const key = action instanceof RegExp
      ? `action_regex:${action.source}`
      : `action:${action}`;
    this.handlers.set(key, handlers);
    return this;
  }

  /**
   * Handle specific events
   */
  event(event: EventType, ...handlers: MiddlewareFn[]): this {
    this.handlers.set(`event:${event}`, handlers);
    return this;
  }

  /**
   * Handle inline queries
   */
  inlineQuery(pattern: string | RegExp, ...handlers: MiddlewareFn[]): this {
    const key = pattern instanceof RegExp
      ? `inline_regex:${pattern.source}`
      : `inline:${pattern}`;
    this.handlers.set(key, handlers);
    return this;
  }

  /**
   * Create middleware function
   */
  middleware(): MiddlewareFn {
    return async (ctx: MiddlewareContext, next: () => Promise<void>) => {
      const update = ctx.update as TelegramUpdate;
      if (!update) return next();

      // Handle commands
      if (update.message?.text) {
        const text = update.message.text;
        
        // Check for bot commands
        if (text.startsWith('/')) {
          const parts = text.split(' ');
          const command = parts[0].replace('/', '').split('@')[0].toLowerCase();
          const handlers = this.handlers.get(`command:${command}`);
          
          if (handlers) {
            const engine = new MiddlewareEngine();
            engine.use(...handlers);
            await engine.run(ctx);
            return;
          }
        }

        // Check for hears patterns
        for (const [key, handlers] of this.handlers.entries()) {
          let matched = false;

          if (key.startsWith('hears:')) {
            const pattern = key.replace('hears:', '');
            if (text.toLowerCase().includes(pattern)) matched = true;
          } else if (key.startsWith('regex:')) {
            const regex = new RegExp(key.replace('regex:', ''));
            if (regex.test(text)) {
              ctx.match = text.match(regex);
              matched = true;
            }
          }

          if (matched) {
            const engine = new MiddlewareEngine();
            engine.use(...handlers);
            await engine.run(ctx);
            return;
          }
        }
      }

      // Handle callback queries
      if (update.callback_query?.data) {
        const data = update.callback_query.data;

        // Check exact action matches
        const exactHandlers = this.handlers.get(`action:${data}`);
        if (exactHandlers) {
          const engine = new MiddlewareEngine();
          engine.use(...exactHandlers);
          await engine.run(ctx);
          return;
        }

        // Check regex action matches
        for (const [key, handlers] of this.handlers.entries()) {
          if (key.startsWith('action_regex:')) {
            const regex = new RegExp(key.replace('action_regex:', ''));
            if (regex.test(data)) {
              ctx.match = data.match(regex);
              const engine = new MiddlewareEngine();
              engine.use(...handlers);
              await engine.run(ctx);
              return;
            }
          }
        }
      }

      // Handle events
      for (const eventType of [
        'message', 'edited_message', 'channel_post', 'edited_channel_post',
        'inline_query', 'chosen_inline_result', 'callback_query',
        'shipping_query', 'pre_checkout_query', 'poll', 'poll_answer',
        'my_chat_member', 'chat_member', 'chat_join_request',
        'message_reaction', 'message_reaction_count'
      ]) {
        if (update[eventType as keyof TelegramUpdate]) {
          const handlers = this.handlers.get(`event:${eventType}`);
          if (handlers) {
            const engine = new MiddlewareEngine();
            engine.use(...handlers);
            await engine.run(ctx);
            return;
          }
        }
      }

      await next();
    };
  }
}

// ==================== Context API ====================
export class Context {
  update: TelegramUpdate;
  bot: any;
  match: RegExpMatchArray | null = null;

  constructor(update: TelegramUpdate, bot: any) {
    this.update = update;
    this.bot = bot;
  }

  get chat() {
    return (
      this.update.message?.chat ||
      this.update.edited_message?.chat ||
      this.update.callback_query?.message?.chat ||
      this.update.channel_post?.chat
    );
  }

  get user() {
    return (
      this.update.message?.from ||
      this.update.edited_message?.from ||
      this.update.callback_query?.from ||
      this.update.inline_query?.from
    );
  }

  get message() {
    return this.update.message || this.update.edited_message;
  }

  get callbackQuery() {
    return this.update.callback_query;
  }

  get inlineQuery() {
    return this.update.inline_query;
  }

  get text() {
    return this.message?.text || '';
  }

  get chatId() {
    return this.chat?.id;
  }

  get userId() {
    return this.user?.id;
  }

  async reply(text: string, options: Record<string, any> = {}): Promise<any> {
    if (!this.chatId) throw new Error('No chat available');
    return this.bot.sendMessage(this.chatId, text, options);
  }

  async replyWithHTML(text: string, options: Record<string, any> = {}): Promise<any> {
    return this.reply(text, { ...options, parse_mode: 'HTML' });
  }

  async replyWithMarkdown(text: string, options: Record<string, any> = {}): Promise<any> {
    return this.reply(text, { ...options, parse_mode: 'MarkdownV2' });
  }

  async edit(text: string, options: Record<string, any> = {}): Promise<any> {
    if (!this.chatId || !this.message?.message_id) {
      throw new Error('No message available');
    }
    return this.bot.editMessageText(this.chatId, this.message.message_id, text, options);
  }

  async delete(): Promise<void> {
    if (this.chatId && this.message?.message_id) {
      await this.bot.deleteMessage(this.chatId, this.message.message_id);
    }
  }

  async answer(text?: string, options: Record<string, any> = {}): Promise<void> {
    if (this.callbackQuery?.id) {
      await this.bot.answerCallbackQuery(this.callbackQuery.id, {
        text,
        ...options
      });
    }
  }

  async answerInline(results: any[], options: Record<string, any> = {}): Promise<void> {
    if (this.inlineQuery?.id) {
      await this.bot.answerInlineQuery(this.inlineQuery.id, results, options);
    }
  }

  async sendChatAction(action: string): Promise<void> {
    if (this.chatId) {
      await this.bot.sendChatAction(this.chatId, action);
    }
  }
}

// ==================== Session Manager ====================
export class SessionManager {
  private store: SessionStore;

  constructor(store?: SessionStore) {
    this.store = store || this.createMemoryStore();
  }

  private createMemoryStore(): SessionStore {
    const sessions = new Map<string, SessionData>();
    return {
      get: async (key: string) => sessions.get(key) || null,
      set: async (key: string, data: SessionData) => { sessions.set(key, data); },
      delete: async (key: string) => { sessions.delete(key); }
    };
  }

  async get(key: string): Promise<SessionData | null> {
    return this.store.get(key);
  }

  async set(key: string, data: SessionData): Promise<void> {
    await this.store.set(key, data);
  }

  async delete(key: string): Promise<void> {
    await this.store.delete(key);
  }

  middleware(): MiddlewareFn {
    return async (ctx: MiddlewareContext, next: () => Promise<void>) => {
      const user = (ctx as any).user;
      const chat = (ctx as any).chat;
      const key = user?.id?.toString() || chat?.id?.toString();

      if (key) {
        const session = await this.get(key);
        ctx.session = session || {};

        await next();

        if (ctx.session) {
          await this.set(key, ctx.session);
        }
      } else {
        await next();
      }
    };
  }
}

// ==================== Plugin System ====================
export class PluginSystem {
  private plugins: Array<(ctx: MiddlewareContext, next: () => Promise<void>) => Promise<void>> = [];

  use(plugin: (ctx: MiddlewareContext, next: () => Promise<void>) => Promise<void>): this {
    this.plugins.push(plugin);
    return this;
  }

  middleware(): MiddlewareFn {
    const plugins = [...this.plugins];

    return async (ctx: MiddlewareContext, next: () => Promise<void>) => {
      const runPlugins = async (index: number): Promise<void> => {
        if (index >= plugins.length) {
          return next();
        }
        await plugins[index](ctx, () => runPlugins(index + 1));
      };

      await runPlugins(0);
    };
  }
}