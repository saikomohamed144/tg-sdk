// ==================== Core Types ====================
export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
  photo_url?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_forum?: boolean;
  photo?: ChatPhoto;
  active_usernames?: string[];
  available_reactions?: string[];
  accent_color_id?: number;
  background_custom_emoji_id?: string;
  profile_accent_color_id?: number;
  profile_background_custom_emoji_id?: string;
  emoji_status_custom_emoji_id?: string;
  emoji_status_expiration_date?: number;
  bio?: string;
  has_private_forwards?: boolean;
  has_restricted_voice_and_video_messages?: boolean;
  join_to_send_messages?: boolean;
  join_by_request?: boolean;
  description?: string;
  invite_link?: string;
  pinned_message?: TelegramMessage;
  permissions?: ChatPermissions;
  slow_mode_delay?: number;
  message_auto_delete_time?: number;
  has_aggressive_anti_spam_enabled?: boolean;
  has_hidden_members?: boolean;
  has_protected_content?: boolean;
  has_visible_history?: boolean;
  sticker_set_name?: string;
  can_set_sticker_set?: boolean;
  linked_chat_id?: number;
  location?: ChatLocation;
}

export interface ChatPhoto {
  small_file_id: string;
  small_file_unique_id: string;
  big_file_id: string;
  big_file_unique_id: string;
}

export interface ChatPermissions {
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_send_video_notes?: boolean;
  can_send_voice_notes?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
}

export interface ChatLocation {
  location: Location;
  address: string;
}

export interface Location {
  longitude: number;
  latitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

export interface TelegramMessage {
  message_id: number;
  message_thread_id?: number;
  from?: TelegramUser;
  sender_chat?: TelegramChat;
  date: number;
  chat: TelegramChat;
  forward_from?: TelegramUser;
  forward_from_chat?: TelegramChat;
  forward_from_message_id?: number;
  forward_signature?: string;
  forward_sender_name?: string;
  forward_date?: number;
  is_topic_message?: boolean;
  is_automatic_forward?: boolean;
  reply_to_message?: TelegramMessage;
  via_bot?: TelegramUser;
  edit_date?: number;
  has_protected_content?: boolean;
  media_group_id?: string;
  author_signature?: string;
  text?: string;
  entities?: MessageEntity[];
  animation?: Animation;
  audio?: Audio;
  document?: Document;
  photo?: PhotoSize[];
  sticker?: Sticker;
  story?: Story;
  video?: Video;
  video_note?: VideoNote;
  voice?: Voice;
  caption?: string;
  caption_entities?: MessageEntity[];
  has_media_spoiler?: boolean;
  contact?: Contact;
  dice?: Dice;
  game?: Game;
  poll?: Poll;
  venue?: Venue;
  location?: Location;
  new_chat_members?: TelegramUser[];
  left_chat_member?: TelegramUser;
  new_chat_title?: string;
  new_chat_photo?: PhotoSize[];
  delete_chat_photo?: boolean;
  group_chat_created?: boolean;
  supergroup_chat_created?: boolean;
  channel_chat_created?: boolean;
  message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged;
  migrate_to_chat_id?: number;
  migrate_from_chat_id?: number;
  pinned_message?: TelegramMessage;
  invoice?: Invoice;
  successful_payment?: SuccessfulPayment;
  user_shared?: UserShared;
  chat_shared?: ChatShared;
  connected_website?: string;
  write_access_allowed?: WriteAccessAllowed;
  passport_data?: PassportData;
  proximity_alert_triggered?: ProximityAlertTriggered;
  forum_topic_created?: ForumTopicCreated;
  forum_topic_edited?: ForumTopicEdited;
  forum_topic_closed?: ForumTopicClosed;
  forum_topic_reopened?: ForumTopicReopened;
  general_forum_topic_hidden?: GeneralForumTopicHidden;
  general_forum_topic_unhidden?: GeneralForumTopicUnhidden;
  giveaway_created?: GiveawayCreated;
  giveaway?: Giveaway;
  giveaway_winners?: GiveawayWinners;
  giveaway_completed?: GiveawayCompleted;
  video_chat_scheduled?: VideoChatScheduled;
  video_chat_started?: VideoChatStarted;
  video_chat_ended?: VideoChatEnded;
  video_chat_participants_invited?: VideoChatParticipantsInvited;
  web_app_data?: WebAppData;
  reply_markup?: InlineKeyboardMarkup;
}

export interface MessageEntity {
  type: 'mention' | 'hashtag' | 'cashtag' | 'bot_command' | 'url' | 'email' | 'phone_number' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'spoiler' | 'code' | 'pre' | 'text_link' | 'text_mention' | 'custom_emoji';
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUser;
  language?: string;
  custom_emoji_id?: string;
}

export interface PhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface Animation {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  thumbnail?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface Audio {
  file_id: string;
  file_unique_id: string;
  duration: number;
  performer?: string;
  title?: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
  thumbnail?: PhotoSize;
}

export interface Document {
  file_id: string;
  file_unique_id: string;
  thumbnail?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface Video {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  thumbnail?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface VideoNote {
  file_id: string;
  file_unique_id: string;
  length: number;
  duration: number;
  thumbnail?: PhotoSize;
  file_size?: number;
}

export interface Voice {
  file_id: string;
  file_unique_id: string;
  duration: number;
  mime_type?: string;
  file_size?: number;
}

export interface Contact {
  phone_number: string;
  first_name: string;
  last_name?: string;
  user_id?: number;
  vcard?: string;
}

export interface Dice {
  emoji: string;
  value: number;
}

export interface PollOption {
  text: string;
  voter_count: number;
}

export interface PollAnswer {
  poll_id: string;
  voter_chat?: TelegramChat;
  user?: TelegramUser;
  option_ids: number[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  total_voter_count: number;
  is_closed: boolean;
  is_anonymous: boolean;
  type: 'regular' | 'quiz';
  allows_multiple_answers: boolean;
  correct_option_id?: number;
  explanation?: string;
  explanation_entities?: MessageEntity[];
  open_period?: number;
  close_date?: number;
}

export interface Venue {
  location: Location;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
}

export interface WebAppData {
  data: string;
  button_text: string;
}

export interface ProximityAlertTriggered {
  traveler: TelegramUser;
  watcher: TelegramUser;
  distance: number;
}

export interface MessageAutoDeleteTimerChanged {
  message_auto_delete_time: number;
}

export interface ForumTopicCreated {
  name: string;
  icon_color: number;
  icon_custom_emoji_id?: string;
}

export interface ForumTopicClosed {}
export interface ForumTopicEdited {
  name?: string;
  icon_custom_emoji_id?: string;
}

export interface ForumTopicReopened {}
export interface GeneralForumTopicHidden {}
export interface GeneralForumTopicUnhidden {}

export interface UserShared {
  request_id: number;
  user_id: number;
}

export interface ChatShared {
  request_id: number;
  chat_id: number;
}

export interface WriteAccessAllowed {
  from_request?: boolean;
  web_app_name?: string;
  from_attachment_menu?: boolean;
}

export interface VideoChatScheduled {
  start_date: number;
}

export interface VideoChatStarted {}
export interface VideoChatEnded {
  duration: number;
}

export interface VideoChatParticipantsInvited {
  users: TelegramUser[];
}

export interface GiveawayCreated {
  prize_description?: string;
}

export interface Giveaway {
  chats: TelegramChat[];
  winners_selection_date: number;
  winner_count: number;
  only_new_members?: boolean;
  has_public_winners?: boolean;
  prize_description?: string;
  country_codes?: string[];
  prize_star_count?: number;
  premium_subscription_month_count?: number;
}

export interface GiveawayWinners {
  chat: TelegramChat;
  giveaway_message_id: number;
  winners_selection_date: number;
  winner_count: number;
  winners: TelegramUser[];
  additional_chat_count?: number;
  prize_star_count?: number;
  premium_subscription_month_count?: number;
  unclaimed_prize_count?: number;
  only_new_members?: boolean;
  was_refunded?: boolean;
  prize_description?: string;
}

export interface GiveawayCompleted {
  winner_count: number;
  unclaimed_prize_count?: number;
  giveaway_message?: TelegramMessage;
  is_star_giveaway?: boolean;
}

export interface Sticker {
  file_id: string;
  file_unique_id: string;
  type: 'regular' | 'mask' | 'custom_emoji';
  width: number;
  height: number;
  is_animated: boolean;
  is_video: boolean;
  thumbnail?: PhotoSize;
  emoji?: string;
  set_name?: string;
  premium_animation?: File;
  mask_position?: MaskPosition;
  custom_emoji_id?: string;
  needs_repainting?: boolean;
  file_size?: number;
}

export interface MaskPosition {
  point: 'forehead' | 'eyes' | 'mouth' | 'chin';
  x_shift: number;
  y_shift: number;
  scale: number;
}

export interface Story {}

export interface Invoice {
  title: string;
  description: string;
  start_parameter: string;
  currency: string;
  total_amount: number;
}

export interface SuccessfulPayment {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
}

export interface OrderInfo {
  name?: string;
  phone_number?: string;
  email?: string;
  shipping_address?: ShippingAddress;
}

export interface ShippingAddress {
  country_code: string;
  state: string;
  city: string;
  street_line1: string;
  street_line2: string;
  post_code: string;
}

export interface PassportData {
  data: EncryptedPassportElement[];
  credentials: EncryptedCredentials;
}

export interface EncryptedPassportElement {}
export interface EncryptedCredentials {}

export interface Game {
  title: string;
  description: string;
  photo: PhotoSize[];
  text?: string;
  text_entities?: MessageEntity[];
  animation?: Animation;
}

export interface CallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  inline_message_id?: string;
  chat_instance?: string;
  data?: string;
  game_short_name?: string;
}

export interface InlineQuery {
  id: string;
  from: TelegramUser;
  query: string;
  offset: string;
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
  location?: Location;
}

export interface ChosenInlineResult {
  result_id: string;
  from: TelegramUser;
  location?: Location;
  inline_message_id?: string;
  query: string;
}

export interface ChatMemberUpdated {
  chat: TelegramChat;
  from: TelegramUser;
  date: number;
  old_chat_member: ChatMember;
  new_chat_member: ChatMember;
  invite_link?: ChatInviteLink;
  via_chat_folder_invite_link?: boolean;
}

export interface ChatMember {
  status: 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';
  user: TelegramUser;
  is_anonymous?: boolean;
  custom_title?: string;
  can_be_edited?: boolean;
  can_manage_chat?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_delete_messages?: boolean;
  can_manage_video_chats?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  is_member?: boolean;
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_send_video_notes?: boolean;
  can_send_voice_notes?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
  until_date?: number;
}

export interface ChatInviteLink {
  invite_link: string;
  creator: TelegramUser;
  creates_join_request: boolean;
  is_primary: boolean;
  is_revoked: boolean;
  name?: string;
  expire_date?: number;
  member_limit?: number;
  pending_join_request_count?: number;
}

export interface ChatJoinRequest {
  chat: TelegramChat;
  from: TelegramUser;
  user_chat_id: number;
  date: number;
  bio?: string;
  invite_link?: ChatInviteLink;
}

export interface ShippingQuery {
  id: string;
  from: TelegramUser;
  invoice_payload: string;
  shipping_address: ShippingAddress;
}

export interface PreCheckoutQuery {
  id: string;
  from: TelegramUser;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
}

// ==================== Update Types ====================
export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
  edited_channel_post?: TelegramMessage;
  message_reaction?: MessageReactionUpdated;
  message_reaction_count?: MessageReactionCountUpdated;
  inline_query?: InlineQuery;
  chosen_inline_result?: ChosenInlineResult;
  callback_query?: CallbackQuery;
  shipping_query?: ShippingQuery;
  pre_checkout_query?: PreCheckoutQuery;
  poll?: Poll;
  poll_answer?: PollAnswer;
  my_chat_member?: ChatMemberUpdated;
  chat_member?: ChatMemberUpdated;
  chat_join_request?: ChatJoinRequest;
  chat_boost?: ChatBoostUpdated;
  removed_chat_boost?: ChatBoostRemoved;
}

export interface MessageReactionUpdated {
  chat: TelegramChat;
  message_id: number;
  user?: TelegramUser;
  actor_chat?: TelegramChat;
  date: number;
  old_reaction: ReactionType[];
  new_reaction: ReactionType[];
}

export interface MessageReactionCountUpdated {
  chat: TelegramChat;
  message_id: number;
  date: number;
  reactions: ReactionCount[];
}

export interface ReactionCount {
  type: ReactionType;
  total_count: number;
}

export interface ReactionType {
  type: 'emoji' | 'custom_emoji';
  emoji?: string;
  custom_emoji_id?: string;
}

export interface ChatBoostUpdated {
  chat: TelegramChat;
  boost: ChatBoost;
}

export interface ChatBoostRemoved {
  chat: TelegramChat;
  boost_id: string;
  remove_date: number;
  source: ChatBoostSource;
}

export interface ChatBoost {
  boost_id: string;
  add_date: number;
  expiration_date: number;
  source: ChatBoostSource;
}

export interface ChatBoostSource {
  source: 'premium' | 'gift_code' | 'giveaway';
  user?: TelegramUser;
}

// ==================== Config Types ====================
export interface BotConfig {
  token: string;
  baseUrl?: string;
  timeout?: number;
  retry?: RetryConfig;
  webhook?: WebhookConfig;
  polling?: PollingConfig;
}

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryOn?: number[];
}

export interface WebhookConfig {
  url: string;
  port?: number;
  secretToken?: string;
  certificate?: string;
  ipAddress?: string;
  maxConnections?: number;
  allowedUpdates?: string[];
  dropPendingUpdates?: boolean;
}

export interface PollingConfig {
  timeout?: number;
  limit?: number;
  allowedUpdates?: string[];
  dropPendingUpdates?: boolean;
}

// ==================== Keyboard Types ====================
export interface KeyboardButton {
  text: string;
  request_contact?: boolean;
  request_location?: boolean;
  request_poll?: KeyboardButtonPollType;
  web_app?: WebAppInfo;
  request_users?: KeyboardButtonRequestUsers;
  request_chat?: KeyboardButtonRequestChat;
}

export interface KeyboardButtonPollType {
  type?: 'quiz' | 'regular';
}

export interface WebAppInfo {
  url: string;
}

export interface KeyboardButtonRequestUsers {
  request_id: number;
  user_is_bot?: boolean;
  user_is_premium?: boolean;
  max_quantity?: number;
}

export interface KeyboardButtonRequestChat {
  request_id: number;
  chat_is_channel: boolean;
  chat_is_forum?: boolean;
  chat_has_username?: boolean;
  chat_is_created?: boolean;
  user_administrator_rights?: ChatAdministratorRights;
  bot_administrator_rights?: ChatAdministratorRights;
  bot_is_member?: boolean;
}

export interface ChatAdministratorRights {
  is_anonymous: boolean;
  can_manage_chat: boolean;
  can_delete_messages: boolean;
  can_manage_video_chats: boolean;
  can_restrict_members: boolean;
  can_promote_members: boolean;
  can_change_info: boolean;
  can_invite_users: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
}

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
  web_app?: WebAppInfo;
  login_url?: LoginUrl;
  switch_inline_query?: string;
  switch_inline_query_current_chat?: string;
  switch_inline_query_chosen_chat?: SwitchInlineQueryChosenChat;
  callback_game?: CallbackGame;
  pay?: boolean;
}

export interface LoginUrl {
  url: string;
  forward_text?: string;
  bot_username?: string;
  request_write_access?: boolean;
}

export interface SwitchInlineQueryChosenChat {
  query?: string;
  allow_user_chats?: boolean;
  allow_bot_chats?: boolean;
  allow_group_chats?: boolean;
  allow_channel_chats?: boolean;
}

export interface CallbackGame {}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

export interface ReplyKeyboardMarkup {
  keyboard: KeyboardButton[][];
  is_persistent?: boolean;
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  input_field_placeholder?: string;
  selective?: boolean;
}

export interface ReplyKeyboardRemove {
  remove_keyboard: true;
  selective?: boolean;
}

export interface ForceReply {
  force_reply: true;
  input_field_placeholder?: string;
  selective?: boolean;
}

// ==================== Mini App Types ====================
export interface WebAppInitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  chat?: TelegramChat;
  chat_type?: string;
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
}

export interface ThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

export interface PopupParams {
  title?: string;
  message: string;
  buttons?: PopupButton[];
}

export interface PopupButton {
  id?: string;
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  text?: string;
}

// ==================== Session/State Types ====================
export interface SessionData {
  [key: string]: any;
}

export interface SessionStore {
  get(key: string): Promise<SessionData | null>;
  set(key: string, data: SessionData): Promise<void>;
  delete(key: string): Promise<void>;
}

// ==================== Middleware Types ====================
export interface MiddlewareContext {
  [key: string]: any;
  update?: TelegramUpdate;
  bot?: any;
  session?: SessionData;
}

export type MiddlewareFn = (
  ctx: MiddlewareContext,
  next: () => Promise<void>
) => Promise<void> | void;

// ==================== Broadcast Types ====================
export interface BroadcastConfig {
  chatIds: number[];
  concurrency?: number;
  delay?: number;
  retry?: RetryConfig;
  stopOnError?: boolean;
  onStart?: (total: number) => void;
  onProgress?: (current: number, total: number) => void;
  onSuccess?: (chatId: number, result: any) => void;
  onError?: (chatId: number, error: Error) => void;
  onFinish?: (results: BroadcastResult[]) => void;
}

export interface BroadcastResult {
  chatId: number;
  success: boolean;
  result?: any;
  error?: Error;
}

// ==================== Event Types ====================
export type EventType =
  | 'message'
  | 'edited_message'
  | 'channel_post'
  | 'edited_channel_post'
  | 'inline_query'
  | 'chosen_inline_result'
  | 'callback_query'
  | 'shipping_query'
  | 'pre_checkout_query'
  | 'poll'
  | 'poll_answer'
  | 'my_chat_member'
  | 'chat_member'
  | 'chat_join_request'
  | 'message_reaction'
  | 'message_reaction_count'
  | 'chat_boost'
  | 'removed_chat_boost';

// ==================== Input Media Types ====================
export interface InputMediaPhoto {
  type: 'photo';
  media: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  has_spoiler?: boolean;
}

export interface InputMediaVideo {
  type: 'video';
  media: string;
  thumbnail?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  width?: number;
  height?: number;
  duration?: number;
  supports_streaming?: boolean;
  has_spoiler?: boolean;
}

export interface InputMediaAudio {
  type: 'audio';
  media: string;
  thumbnail?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  duration?: number;
  performer?: string;
  title?: string;
}

export interface InputMediaDocument {
  type: 'document';
  media: string;
  thumbnail?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  disable_content_type_detection?: boolean;
}

export interface InputMediaAnimation {
  type: 'animation';
  media: string;
  thumbnail?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  width?: number;
  height?: number;
  duration?: number;
  has_spoiler?: boolean;
}

export type InputMedia =
  | InputMediaPhoto
  | InputMediaVideo
  | InputMediaAudio
  | InputMediaDocument
  | InputMediaAnimation;

// ==================== Inline Query Result Types ====================
export interface InlineQueryResult {
  type: string;
  id: string;
  // ... more fields depending on type
}

// ==================== Star Invoice Types ====================
export interface StarInvoiceParams {
  title: string;
  description: string;
  payload: string;
  provider_token?: string;
  currency?: string;
  prices?: LabeledPrice[];
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
}

export interface LabeledPrice {
  label: string;
  amount: number;
}