import type {
  BotConfig, TelegramMessage, TelegramUser, TelegramUpdate,
  InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove, ForceReply,
  InputMedia, InlineQueryResult, ChatPermissions, ChatAdministratorRights,
  StarInvoiceParams, BroadcastConfig, BroadcastResult, LabeledPrice
} from './types';
import {
  fetchWithTimeout, withRetry, sleep, MemoryCache, RateLimiter,
  Logger, AsyncQueue, EventEmitter, buildFormData, randomId
} from './utils';
import * as http from 'http';
import * as https from 'https';

export class BotClient extends EventEmitter {
  private token: string;
  private baseUrl: string;
  private config: BotConfig;
  private cache: MemoryCache;
  private rateLimiter: RateLimiter;
  private queue: AsyncQueue;
  private logger: Logger;
  private pollingActive = false;
  private pollingAbortController: AbortController | null = null;
  private webhookServer: http.Server | null = null;
  
  constructor(config: BotConfig) {
    super();
    this.token = config.token;
    this.baseUrl = config.baseUrl || 'https://api.telegram.org';
    this.config = config;
    this.cache = new MemoryCache();
    this.rateLimiter = new RateLimiter(30, 1000);
    this.queue = new AsyncQueue(5);
    this.logger = new Logger();
  }

  // ==================== Core API Method ====================
  private async request<T>(method: string, params: Record<string, any> = {}, useFormData = false): Promise<T> {
    const url = `${this.baseUrl}/bot${this.token}/${method}`;
    
    return this.queue.add(() =>
      withRetry(async () => {
        await this.rateLimiter.acquire();
        
        let body: BodyInit | undefined;
        const headers: Record<string, string> = {};
        
        if (useFormData) {
          body = buildFormData(params);
        } else {
          headers['Content-Type'] = 'application/json';
          body = JSON.stringify(params);
        }
        
        const response = await fetchWithTimeout(url, {
          method: 'POST',
          headers,
          body,
          timeout: this.config.timeout || 30000
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw Object.assign(new Error(`Telegram API error: ${response.status}`), {
            status: response.status,
            body: error
          });
        }

        const data = await response.json();
        if (!data.ok) {
          throw new Error(`Telegram API error: ${data.description}`);
        }

        return data.result as T;
      }, this.config.retry)
    );
  }

  // ==================== Message Methods ====================
  async sendMessage(
    chatId: number | string,
    text: string,
    options: {
      parse_mode?: 'HTML' | 'MarkdownV2' | 'Markdown';
      entities?: any[];
      disable_web_page_preview?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('sendMessage', { chat_id: chatId, text, ...options });
  }

  async forwardMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    options: {
      message_thread_id?: number;
      disable_notification?: boolean;
      protect_content?: boolean;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('forwardMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...options
    });
  }

  async forwardMessages(
    chatId: number | string,
    fromChatId: number | string,
    messageIds: number[],
    options: {
      message_thread_id?: number;
      disable_notification?: boolean;
      protect_content?: boolean;
    } = {}
  ): Promise<any> {
    return this.request('forwardMessages', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_ids: messageIds,
      ...options
    });
  }

  async copyMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    options: {
      message_thread_id?: number;
      caption?: string;
      parse_mode?: string;
      caption_entities?: any[];
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
    } = {}
  ): Promise<any> {
    return this.request('copyMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...options
    });
  }

  async copyMessages(
    chatId: number | string,
    fromChatId: number | string,
    messageIds: number[],
    options: {
      message_thread_id?: number;
      disable_notification?: boolean;
      protect_content?: boolean;
      remove_caption?: boolean;
    } = {}
  ): Promise<any> {
    return this.request('copyMessages', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_ids: messageIds,
      ...options
    });
  }

  // ==================== Media Methods ====================
  async sendPhoto(
    chatId: number | string,
    photo: string | Blob,
    options: {
      caption?: string;
      parse_mode?: string;
      caption_entities?: any[];
      has_spoiler?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    const useFormData = photo instanceof Blob;
    return this.request('sendPhoto', { chat_id: chatId, photo, ...options }, useFormData);
  }

  async sendAudio(
    chatId: number | string,
    audio: string | Blob,
    options: {
      caption?: string;
      parse_mode?: string;
      caption_entities?: any[];
      duration?: number;
      performer?: string;
      title?: string;
      thumbnail?: string | Blob;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    const useFormData = audio instanceof Blob || options.thumbnail instanceof Blob;
    return this.request('sendAudio', { chat_id: chatId, audio, ...options }, useFormData);
  }

  async sendDocument(
    chatId: number | string,
    document: string | Blob,
    options: {
      thumbnail?: string | Blob;
      caption?: string;
      parse_mode?: string;
      caption_entities?: any[];
      disable_content_type_detection?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    const useFormData = document instanceof Blob || options.thumbnail instanceof Blob;
    return this.request('sendDocument', { chat_id: chatId, document, ...options }, useFormData);
  }

  async sendVideo(
    chatId: number | string,
    video: string | Blob,
    options: {
      duration?: number;
      width?: number;
      height?: number;
      thumbnail?: string | Blob;
      caption?: string;
      parse_mode?: string;
      caption_entities?: any[];
      has_spoiler?: boolean;
      supports_streaming?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    const useFormData = video instanceof Blob || options.thumbnail instanceof Blob;
    return this.request('sendVideo', { chat_id: chatId, video, ...options }, useFormData);
  }

  async sendAnimation(
    chatId: number | string,
    animation: string | Blob,
    options: {
      duration?: number;
      width?: number;
      height?: number;
      thumbnail?: string | Blob;
      caption?: string;
      parse_mode?: string;
      caption_entities?: any[];
      has_spoiler?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    const useFormData = animation instanceof Blob || options.thumbnail instanceof Blob;
    return this.request('sendAnimation', { chat_id: chatId, animation, ...options }, useFormData);
  }

  async sendVoice(
    chatId: number | string,
    voice: string | Blob,
    options: {
      caption?: string;
      parse_mode?: string;
      caption_entities?: any[];
      duration?: number;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    const useFormData = voice instanceof Blob;
    return this.request('sendVoice', { chat_id: chatId, voice, ...options }, useFormData);
  }

  async sendVideoNote(
    chatId: number | string,
    videoNote: string | Blob,
    options: {
      duration?: number;
      length?: number;
      thumbnail?: string | Blob;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    const useFormData = videoNote instanceof Blob || options.thumbnail instanceof Blob;
    return this.request('sendVideoNote', { chat_id: chatId, video_note: videoNote, ...options }, useFormData);
  }

  async sendMediaGroup(
    chatId: number | string,
    media: InputMedia[],
    options: {
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage[]> {
    return this.request('sendMediaGroup', { chat_id: chatId, media, ...options });
  }

  async sendLocation(
    chatId: number | string,
    latitude: number,
    longitude: number,
    options: {
      horizontal_accuracy?: number;
      live_period?: number;
      heading?: number;
      proximity_alert_radius?: number;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('sendLocation', {
      chat_id: chatId, latitude, longitude, ...options
    });
  }

  async sendVenue(
    chatId: number | string,
    latitude: number,
    longitude: number,
    title: string,
    address: string,
    options: {
      foursquare_id?: string;
      foursquare_type?: string;
      google_place_id?: string;
      google_place_type?: string;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('sendVenue', {
      chat_id: chatId, latitude, longitude, title, address, ...options
    });
  }

  async sendContact(
    chatId: number | string,
    phoneNumber: string,
    firstName: string,
    options: {
      last_name?: string;
      vcard?: string;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('sendContact', {
      chat_id: chatId, phone_number: phoneNumber, first_name: firstName, ...options
    });
  }

  async sendPoll(
    chatId: number | string,
    question: string,
    pollOptions: string[],
    options: {
      is_anonymous?: boolean;
      type?: 'quiz' | 'regular';
      allows_multiple_answers?: boolean;
      correct_option_id?: number;
      explanation?: string;
      explanation_parse_mode?: string;
      explanation_entities?: any[];
      open_period?: number;
      close_date?: number;
      is_closed?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('sendPoll', {
      chat_id: chatId, question, options: pollOptions, ...options
    });
  }

  async sendDice(
    chatId: number | string,
    options: {
      emoji?: string;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('sendDice', { chat_id: chatId, ...options });
  }

  async sendChatAction(
    chatId: number | string,
    action: 'typing' | 'upload_photo' | 'record_video' | 'upload_video' | 'record_voice' | 'upload_voice' | 'upload_document' | 'choose_sticker' | 'find_location' | 'record_video_note' | 'upload_video_note',
    options: { message_thread_id?: number } = {}
  ): Promise<boolean> {
    return this.request('sendChatAction', { chat_id: chatId, action, ...options });
  }

  async setMessageReaction(
    chatId: number | string,
    messageId: number,
    options: {
      reaction?: any[];
      is_big?: boolean;
    } = {}
  ): Promise<boolean> {
    return this.request('setMessageReaction', {
      chat_id: chatId, message_id: messageId, ...options
    });
  }

  // ==================== Edit Methods ====================
  async editMessageText(
    chatId: number | string,
    messageId: number,
    text: string,
    options: {
      parse_mode?: string;
      entities?: any[];
      disable_web_page_preview?: boolean;
      reply_markup?: InlineKeyboardMarkup;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('editMessageText', {
      chat_id: chatId, message_id: messageId, text, ...options
    });
  }

  async editMessageCaption(
    chatId: number | string,
    messageId: number,
    options: {
      caption?: string;
      parse_mode?: string;
      caption_entities?: any[];
      reply_markup?: InlineKeyboardMarkup;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('editMessageCaption', {
      chat_id: chatId, message_id: messageId, ...options
    });
  }

  async editMessageMedia(
    chatId: number | string,
    messageId: number,
    media: InputMedia,
    options: { reply_markup?: InlineKeyboardMarkup } = {}
  ): Promise<TelegramMessage> {
    return this.request('editMessageMedia', {
      chat_id: chatId, message_id: messageId, media, ...options
    });
  }

  async editMessageReplyMarkup(
    chatId: number | string,
    messageId: number,
    options: { reply_markup?: InlineKeyboardMarkup } = {}
  ): Promise<TelegramMessage> {
    return this.request('editMessageReplyMarkup', {
      chat_id: chatId, message_id: messageId, ...options
    });
  }

  async stopPoll(
    chatId: number | string,
    messageId: number,
    options: { reply_markup?: InlineKeyboardMarkup } = {}
  ): Promise<any> {
    return this.request('stopPoll', {
      chat_id: chatId, message_id: messageId, ...options
    });
  }

  async deleteMessage(chatId: number | string, messageId: number): Promise<boolean> {
    return this.request('deleteMessage', { chat_id: chatId, message_id: messageId });
  }

  async deleteMessages(chatId: number | string, messageIds: number[]): Promise<boolean> {
    return this.request('deleteMessages', { chat_id: chatId, message_ids: messageIds });
  }

  // ==================== Sticker Methods ====================
  async sendSticker(
    chatId: number | string,
    sticker: string,
    options: {
      emoji?: string;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('sendSticker', { chat_id: chatId, sticker, ...options });
  }

  async getStickerSet(name: string): Promise<any> {
    return this.request('getStickerSet', { name });
  }

  async getCustomEmojiStickers(customEmojiIds: string[]): Promise<any> {
    return this.request('getCustomEmojiStickers', { custom_emoji_ids: customEmojiIds });
  }

  async uploadStickerFile(userId: number, sticker: Blob, stickerFormat: string): Promise<any> {
    return this.request('uploadStickerFile', {
      user_id: userId, sticker, sticker_format: stickerFormat
    }, true);
  }

  async createNewStickerSet(
    userId: number,
    name: string,
    title: string,
    stickers: any[],
    options: {
      sticker_type?: string;
      needs_repainting?: boolean;
    } = {}
  ): Promise<boolean> {
    return this.request('createNewStickerSet', {
      user_id: userId, name, title, stickers, ...options
    });
  }

  async addStickerToSet(userId: number, name: string, sticker: any): Promise<boolean> {
    return this.request('addStickerToSet', {
      user_id: userId, name, sticker
    });
  }

  async setStickerPositionInSet(sticker: string, position: number): Promise<boolean> {
    return this.request('setStickerPositionInSet', { sticker, position });
  }

  async deleteStickerFromSet(sticker: string): Promise<boolean> {
    return this.request('deleteStickerFromSet', { sticker });
  }

  async setStickerEmojiList(sticker: string, emojiList: string[]): Promise<boolean> {
    return this.request('setStickerEmojiList', { sticker, emoji_list: emojiList });
  }

  async setStickerKeywords(sticker: string, keywords?: string[]): Promise<boolean> {
    return this.request('setStickerKeywords', { sticker, keywords });
  }

  async setStickerMaskPosition(sticker: string, maskPosition?: any): Promise<boolean> {
    return this.request('setStickerMaskPosition', { sticker, mask_position: maskPosition });
  }

  async setStickerSetTitle(name: string, title: string): Promise<boolean> {
    return this.request('setStickerSetTitle', { name, title });
  }

  async setStickerSetThumbnail(name: string, userId: number, thumbnail?: string): Promise<boolean> {
    return this.request('setStickerSetThumbnail', { name, user_id: userId, thumbnail });
  }

  async deleteStickerSet(name: string): Promise<boolean> {
    return this.request('deleteStickerSet', { name });
  }

  // ==================== Chat Methods ====================
  async getChat(chatId: number | string): Promise<any> {
    return this.request('getChat', { chat_id: chatId });
  }

  async getChatAdministrators(chatId: number | string): Promise<any[]> {
    return this.request('getChatAdministrators', { chat_id: chatId });
  }

  async getChatMemberCount(chatId: number | string): Promise<number> {
    return this.request('getChatMemberCount', { chat_id: chatId });
  }

  async getChatMember(chatId: number | string, userId: number): Promise<any> {
    return this.request('getChatMember', { chat_id: chatId, user_id: userId });
  }

  async leaveChat(chatId: number | string): Promise<boolean> {
    return this.request('leaveChat', { chat_id: chatId });
  }

  async banChatMember(
    chatId: number | string,
    userId: number,
    options: { until_date?: number; revoke_messages?: boolean } = {}
  ): Promise<boolean> {
    return this.request('banChatMember', {
      chat_id: chatId, user_id: userId, ...options
    });
  }

  async unbanChatMember(
    chatId: number | string,
    userId: number,
    options: { only_if_banned?: boolean } = {}
  ): Promise<boolean> {
    return this.request('unbanChatMember', {
      chat_id: chatId, user_id: userId, ...options
    });
  }

  async restrictChatMember(
    chatId: number | string,
    userId: number,
    permissions: ChatPermissions,
    options: {
      use_independent_chat_permissions?: boolean;
      until_date?: number;
    } = {}
  ): Promise<boolean> {
    return this.request('restrictChatMember', {
      chat_id: chatId, user_id: userId, permissions, ...options
    });
  }

  async promoteChatMember(
    chatId: number | string,
    userId: number,
    options: ChatAdministratorRights & { is_anonymous?: boolean } = {
      is_anonymous: false,
      can_manage_chat: true,
      can_delete_messages: true,
      can_manage_video_chats: true,
      can_restrict_members: true,
      can_promote_members: true,
      can_change_info: true,
      can_invite_users: true,
      can_pin_messages: true,
      can_manage_topics: true
    }
  ): Promise<boolean> {
    return this.request('promoteChatMember', {
      chat_id: chatId, user_id: userId, ...options
    });
  }

  async setChatAdministratorCustomTitle(
    chatId: number | string,
    userId: number,
    customTitle: string
  ): Promise<boolean> {
    return this.request('setChatAdministratorCustomTitle', {
      chat_id: chatId, user_id: userId, custom_title: customTitle
    });
  }

  async banChatSenderChat(chatId: number | string, senderChatId: number): Promise<boolean> {
    return this.request('banChatSenderChat', {
      chat_id: chatId, sender_chat_id: senderChatId
    });
  }

  async unbanChatSenderChat(chatId: number | string, senderChatId: number): Promise<boolean> {
    return this.request('unbanChatSenderChat', {
      chat_id: chatId, sender_chat_id: senderChatId
    });
  }

  async setChatPermissions(chatId: number | string, permissions: ChatPermissions): Promise<boolean> {
    return this.request('setChatPermissions', { chat_id: chatId, permissions });
  }

  async exportChatInviteLink(chatId: number | string): Promise<string> {
    return this.request('exportChatInviteLink', { chat_id: chatId });
  }

  async createChatInviteLink(
    chatId: number | string,
    options: {
      name?: string;
      expire_date?: number;
      member_limit?: number;
      creates_join_request?: boolean;
    } = {}
  ): Promise<any> {
    return this.request('createChatInviteLink', { chat_id: chatId, ...options });
  }

  async editChatInviteLink(
    chatId: number | string,
    inviteLink: string,
    options: {
      name?: string;
      expire_date?: number;
      member_limit?: number;
      creates_join_request?: boolean;
    } = {}
  ): Promise<any> {
    return this.request('editChatInviteLink', {
      chat_id: chatId, invite_link: inviteLink, ...options
    });
  }

  async revokeChatInviteLink(chatId: number | string, inviteLink: string): Promise<any> {
    return this.request('revokeChatInviteLink', {
      chat_id: chatId, invite_link: inviteLink
    });
  }

  async approveChatJoinRequest(chatId: number | string, userId: number): Promise<boolean> {
    return this.request('approveChatJoinRequest', {
      chat_id: chatId, user_id: userId
    });
  }

  async declineChatJoinRequest(chatId: number | string, userId: number): Promise<boolean> {
    return this.request('declineChatJoinRequest', {
      chat_id: chatId, user_id: userId
    });
  }

  async setChatPhoto(chatId: number | string, photo: Blob): Promise<boolean> {
    return this.request('setChatPhoto', { chat_id: chatId, photo }, true);
  }

  async deleteChatPhoto(chatId: number | string): Promise<boolean> {
    return this.request('deleteChatPhoto', { chat_id: chatId });
  }

  async setChatTitle(chatId: number | string, title: string): Promise<boolean> {
    return this.request('setChatTitle', { chat_id: chatId, title });
  }

  async setChatDescription(chatId: number | string, description?: string): Promise<boolean> {
    return this.request('setChatDescription', { chat_id: chatId, description });
  }

  async pinChatMessage(
    chatId: number | string,
    messageId: number,
    options: { disable_notification?: boolean } = {}
  ): Promise<boolean> {
    return this.request('pinChatMessage', {
      chat_id: chatId, message_id: messageId, ...options
    });
  }

  async unpinChatMessage(chatId: number | string, messageId?: number): Promise<boolean> {
    return this.request('unpinChatMessage', {
      chat_id: chatId, message_id: messageId
    });
  }

  async unpinAllChatMessages(chatId: number | string): Promise<boolean> {
    return this.request('unpinAllChatMessages', { chat_id: chatId });
  }

  // ==================== User Methods ====================
  async getMe(): Promise<TelegramUser> {
    const cached = this.cache.get<TelegramUser>('me');
    if (cached) return cached;

    const me = await this.request<TelegramUser>('getMe');
    this.cache.set('me', me, 5 * 60 * 1000);
    return me;
  }

  async getUserProfilePhotos(
    userId: number,
    options: { offset?: number; limit?: number } = {}
  ): Promise<any> {
    return this.request('getUserProfilePhotos', { user_id: userId, ...options });
  }

  // ==================== Webhook Methods ====================
  async setWebhook(
    url: string,
    options: {
      certificate?: Blob;
      ip_address?: string;
      max_connections?: number;
      allowed_updates?: string[];
      drop_pending_updates?: boolean;
      secret_token?: string;
    } = {}
  ): Promise<boolean> {
    const useFormData = !!options.certificate;
    return this.request('setWebhook', { url, ...options }, useFormData);
  }

  async deleteWebhook(options: { drop_pending_updates?: boolean } = {}): Promise<boolean> {
    return this.request('deleteWebhook', options);
  }

  async getWebhookInfo(): Promise<any> {
    return this.request('getWebhookInfo');
  }

  // ==================== Polling Methods ====================
  async startPolling(
    options: {
      timeout?: number;
      limit?: number;
      allowedUpdates?: string[];
      dropPendingUpdates?: boolean;
      onUpdate?: (update: TelegramUpdate) => Promise<void>;
    } = {}
  ): Promise<void> {
    if (this.pollingActive) {
      throw new Error('Polling is already active');
    }

    const {
      timeout = 30,
      limit = 100,
      allowedUpdates,
      dropPendingUpdates,
      onUpdate
    } = options;

    if (dropPendingUpdates) {
      await this.deleteWebhook({ drop_pending_updates: true });
    }

    this.pollingActive = true;
    this.pollingAbortController = new AbortController();
    let offset = 0;

    const poll = async () => {
      while (this.pollingActive) {
        try {
          const updates = await this.request<TelegramUpdate[]>('getUpdates', {
            offset,
            timeout,
            limit,
            allowed_updates: allowedUpdates
          });

          if (updates.length > 0) {
            offset = updates[updates.length - 1].update_id + 1;

            for (const update of updates) {
              try {
                if (onUpdate) {
                  await onUpdate(update);
                }
                this.emit('update', update);
                
                // Emit specific events
                for (const key of Object.keys(update)) {
                  if (key !== 'update_id' && update[key as keyof TelegramUpdate]) {
                    this.emit(key, update[key as keyof TelegramUpdate]);
                  }
                }
              } catch (error) {
                this.logger.error('Error processing update:', error);
                this.emit('error', error);
              }
            }
          }
        } catch (error: any) {
          if (!this.pollingActive) break;
          this.logger.error('Polling error:', error);
          this.emit('error', error);
          await sleep(1000);
        }
      }
    };

    poll();
  }

  async stopPolling(): Promise<void> {
    this.pollingActive = false;
    if (this.pollingAbortController) {
      this.pollingAbortController.abort();
      this.pollingAbortController = null;
    }
  }

  // ==================== Webhook Server Methods ====================
  async startWebhook(
    options: {
      port?: number;
      path?: string;
      secretToken?: string;
      onUpdate?: (update: TelegramUpdate) => Promise<void>;
    } = {}
  ): Promise<void> {
    const { port = 8443, path = '/webhook', secretToken, onUpdate } = options;

    if (this.webhookServer) {
      throw new Error('Webhook server is already running');
    }

    this.webhookServer = http.createServer(async (req, res) => {
      if (req.method === 'POST' && req.url === path) {
        let body = '';
        
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            // Verify secret token if provided
            if (secretToken) {
              const token = req.headers['x-telegram-bot-api-secret-token'];
              if (token !== secretToken) {
                res.writeHead(403);
                res.end('Forbidden');
                return;
              }
            }

            const update: TelegramUpdate = JSON.parse(body);
            
            if (onUpdate) {
              await onUpdate(update);
            }
            
            this.emit('update', update);
            
            for (const key of Object.keys(update)) {
              if (key !== 'update_id' && update[key as keyof TelegramUpdate]) {
                this.emit(key, update[key as keyof TelegramUpdate]);
              }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
          } catch (error) {
            this.logger.error('Webhook error:', error);
            this.emit('error', error);
            res.writeHead(500);
            res.end('Internal Server Error');
          }
        });
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    return new Promise((resolve, reject) => {
      this.webhookServer!.listen(port, () => {
        this.logger.info(`Webhook server listening on port ${port}`);
        resolve();
      });
      this.webhookServer!.on('error', reject);
    });
  }

  async stopWebhook(): Promise<void> {
    if (this.webhookServer) {
      return new Promise((resolve) => {
        this.webhookServer!.close(() => {
          this.webhookServer = null;
          resolve();
        });
      });
    }
  }

  // ==================== File Methods ====================
  async getFile(fileId: string): Promise<any> {
    return this.request('getFile', { file_id: fileId });
  }

  getFileUrl(filePath: string): string {
    return `${this.baseUrl}/file/bot${this.token}/${filePath}`;
  }

  async downloadFile(fileIdOrPath: string): Promise<ArrayBuffer> {
    let filePath = fileIdOrPath;
    
    // If it looks like a file_id, get the file path first
    if (!fileIdOrPath.includes('/')) {
      const file = await this.getFile(fileIdOrPath);
      if (!file.file_path) throw new Error('File path not available');
      filePath = file.file_path;
    }
    
    const url = this.getFileUrl(filePath);
    const response = await fetchWithTimeout(url, { timeout: 60000 });
    if (!response.ok) throw new Error(`Failed to download file: ${response.status}`);
    return response.arrayBuffer();
  }

  // ==================== Inline Mode Methods ====================
  async answerInlineQuery(
    inlineQueryId: string,
    results: InlineQueryResult[],
    options: {
      cache_time?: number;
      is_personal?: boolean;
      next_offset?: string;
      button?: any;
    } = {}
  ): Promise<boolean> {
    return this.request('answerInlineQuery', {
      inline_query_id: inlineQueryId, results, ...options
    });
  }

  async answerWebAppQuery(
    webAppQueryId: string,
    result: InlineQueryResult
  ): Promise<any> {
    return this.request('answerWebAppQuery', {
      web_app_query_id: webAppQueryId, result
    });
  }

  // ==================== Callback Methods ====================
  async answerCallbackQuery(
    callbackQueryId: string,
    options: {
      text?: string;
      show_alert?: boolean;
      url?: string;
      cache_time?: number;
    } = {}
  ): Promise<boolean> {
    return this.request('answerCallbackQuery', {
      callback_query_id: callbackQueryId, ...options
    });
  }

  // ==================== Payment Methods ====================
  async sendInvoice(
    chatId: number | string,
    title: string,
    description: string,
    payload: string,
    prices: LabeledPrice[],
    options: {
      provider_token?: string;
      currency?: string;
      max_tip_amount?: number;
      suggested_tip_amounts?: number[];
      start_parameter?: string;
      provider_data?: string;
      photo_url?: string;
      photo_size?: number;
      photo_width?: number;
      photo_height?: number;
      need_name?: boolean;
      need_phone_number?: boolean;
      need_email?: boolean;
      need_shipping_address?: boolean;
      send_phone_number_to_provider?: boolean;
      send_email_to_provider?: boolean;
      is_flexible?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('sendInvoice', {
      chat_id: chatId, title, description, payload,
      currency: options.currency || 'XTR', prices, ...options
    });
  }

  async createInvoiceLink(
    title: string,
    description: string,
    payload: string,
    prices: LabeledPrice[],
    options: {
      provider_token?: string;
      currency?: string;
      max_tip_amount?: number;
      suggested_tip_amounts?: number[];
      provider_data?: string;
      photo_url?: string;
      photo_size?: number;
      photo_width?: number;
      photo_height?: number;
      need_name?: boolean;
      need_phone_number?: boolean;
      need_email?: boolean;
      need_shipping_address?: boolean;
      send_phone_number_to_provider?: boolean;
      send_email_to_provider?: boolean;
      is_flexible?: boolean;
    } = {}
  ): Promise<string> {
    return this.request('createInvoiceLink', {
      title, description, payload,
      currency: options.currency || 'XTR', prices, ...options
    });
  }

  async answerShippingQuery(
    shippingQueryId: string,
    ok: boolean,
    options: {
      shipping_options?: any[];
      error_message?: string;
    } = {}
  ): Promise<boolean> {
    return this.request('answerShippingQuery', {
      shipping_query_id: shippingQueryId, ok, ...options
    });
  }

  async answerPreCheckoutQuery(
    preCheckoutQueryId: string,
    ok: boolean,
    options: { error_message?: string } = {}
  ): Promise<boolean> {
    return this.request('answerPreCheckoutQuery', {
      pre_checkout_query_id: preCheckoutQueryId, ok, ...options
    });
  }

  async createStarsInvoice(
    params: StarInvoiceParams
  ): Promise<string> {
    return this.createInvoiceLink(
      params.title,
      params.description,
      params.payload,
      params.prices || [{ label: 'Stars', amount: params.max_tip_amount || 1 }],
      { currency: 'XTR', ...params }
    );
  }

  async sendStarsInvoice(
    chatId: number | string,
    params: StarInvoiceParams
  ): Promise<TelegramMessage> {
    return this.sendInvoice(
      chatId,
      params.title,
      params.description,
      params.payload,
      params.prices || [{ label: 'Stars', amount: params.max_tip_amount || 1 }],
      { currency: 'XTR', ...params }
    );
  }

  async refundStarPayment(
    userId: number,
    telegramPaymentChargeId: string
  ): Promise<boolean> {
    return this.request('refundStarPayment', {
      user_id: userId,
      telegram_payment_charge_id: telegramPaymentChargeId
    });
  }

  // ==================== Forum Methods ====================
  async createForumTopic(
    chatId: number | string,
    name: string,
    options: {
      icon_color?: number;
      icon_custom_emoji_id?: string;
    } = {}
  ): Promise<any> {
    return this.request('createForumTopic', { chat_id: chatId, name, ...options });
  }

  async editForumTopic(
    chatId: number | string,
    messageThreadId: number,
    options: {
      name?: string;
      icon_custom_emoji_id?: string;
    } = {}
  ): Promise<boolean> {
    return this.request('editForumTopic', {
      chat_id: chatId, message_thread_id: messageThreadId, ...options
    });
  }

  async closeForumTopic(chatId: number | string, messageThreadId: number): Promise<boolean> {
    return this.request('closeForumTopic', {
      chat_id: chatId, message_thread_id: messageThreadId
    });
  }

  async reopenForumTopic(chatId: number | string, messageThreadId: number): Promise<boolean> {
    return this.request('reopenForumTopic', {
      chat_id: chatId, message_thread_id: messageThreadId
    });
  }

  async deleteForumTopic(chatId: number | string, messageThreadId: number): Promise<boolean> {
    return this.request('deleteForumTopic', {
      chat_id: chatId, message_thread_id: messageThreadId
    });
  }

  async unpinAllForumTopicMessages(
    chatId: number | string,
    messageThreadId: number
  ): Promise<boolean> {
    return this.request('unpinAllForumTopicMessages', {
      chat_id: chatId, message_thread_id: messageThreadId
    });
  }

  async editGeneralForumTopic(chatId: number | string, name: string): Promise<boolean> {
    return this.request('editGeneralForumTopic', { chat_id: chatId, name });
  }

  async closeGeneralForumTopic(chatId: number | string): Promise<boolean> {
    return this.request('closeGeneralForumTopic', { chat_id: chatId });
  }

  async reopenGeneralForumTopic(chatId: number | string): Promise<boolean> {
    return this.request('reopenGeneralForumTopic', { chat_id: chatId });
  }

  async hideGeneralForumTopic(chatId: number | string): Promise<boolean> {
    return this.request('hideGeneralForumTopic', { chat_id: chatId });
  }

  async unhideGeneralForumTopic(chatId: number | string): Promise<boolean> {
    return this.request('unhideGeneralForumTopic', { chat_id: chatId });
  }

  async unpinAllGeneralForumTopicMessages(chatId: number | string): Promise<boolean> {
    return this.request('unpinAllGeneralForumTopicMessages', { chat_id: chatId });
  }

  // ==================== Game Methods ====================
  async sendGame(
    chatId: number | string,
    gameShortName: string,
    options: {
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: InlineKeyboardMarkup;
      message_thread_id?: number;
    } = {}
  ): Promise<TelegramMessage> {
    return this.request('sendGame', {
      chat_id: chatId, game_short_name: gameShortName, ...options
    });
  }

  async setGameScore(
    userId: number,
    score: number,
    options: {
      force?: boolean;
      disable_edit_message?: boolean;
      chat_id?: number;
      message_id?: number;
      inline_message_id?: string;
    } = {}
  ): Promise<any> {
    return this.request('setGameScore', {
      user_id: userId, score, ...options
    });
  }

  async getGameHighScores(
    userId: number,
    options: {
      chat_id?: number;
      message_id?: number;
      inline_message_id?: string;
    } = {}
  ): Promise<any> {
    return this.request('getGameHighScores', {
      user_id: userId, ...options
    });
  }

  // ==================== Broadcast Method ====================
  async broadcast(
    method: string,
    params: Record<string, any>,
    config: BroadcastConfig
  ): Promise<BroadcastResult[]> {
    const {
      chatIds,
      concurrency = 5,
      delay = 1000,
      stopOnError = false,
      onStart,
      onProgress,
      onSuccess,
      onError,
      onFinish
    } = config;

    const results: BroadcastResult[] = [];
    onStart?.(chatIds.length);

    for (let i = 0; i < chatIds.length; i += concurrency) {
      const batch = chatIds.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(
        batch.map(async (chatId) => {
          try {
            const result = await this.request(method, {
              chat_id: chatId,
              ...params
            });
            onSuccess?.(chatId, result);
            return { chatId, success: true, result };
          } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            onError?.(chatId, err);
            if (stopOnError) throw err;
            return { chatId, success: false, error: err };
          }
        })
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        }
      }

      onProgress?.(Math.min(i + concurrency, chatIds.length), chatIds.length);

      if (i + concurrency < chatIds.length && delay > 0) {
        await sleep(delay);
      }
    }

    onFinish?.(results);
    return results;
  }
}