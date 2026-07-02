# @abdosaiko20/tg-sdk

🚀 **Lightweight, production-ready, comprehensive Telegram SDK** for Bots and Mini Apps.

[![npm version](https://badge.fury.io/js/@abdosaiko20/tg--sdk.svg)](https://www.npmjs.com/package/@abdosaiko20/tg-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

## ✨ Features

- 🎯 **Complete Telegram Bot API** - All methods, types, and features
- 📱 **Mini Apps Support** - Full Telegram WebApp API
- ⚡ **Polling & Webhook** - Both update receiving methods
- 🎨 **Keyboard Builders** - Fluent API for Inline & Reply keyboards
- 📝 **Markdown & HTML** - Safe builders for formatted messages
- 🔄 **Middleware System** - Express-like middleware engine
- 🛣️ **Router** - Command, hears, action, event routing
- 💾 **Session Manager** - Built-in session with custom storage
- 🔌 **Plugin System** - Extensible plugin architecture
- ⭐ **Telegram Stars** - Full payment support
- 📡 **Broadcast** - Message broadcasting with concurrency
- ⚛️ **React Hooks** - First-class React support
- 🔒 **Fully Typed** - Complete TypeScript definitions
- 0️⃣ **Zero Dependencies** - No runtime dependencies
- 🌳 **Tree-shakeable** - Import only what you need
- 🌍 **Universal** - Node.js, Deno, Bun, Cloudflare Workers, Vercel Edge

## 📦 Installation

```bash
npm install @abdosaiko20/tg-sdk
# or
yarn add @abdosaiko20/tg-sdk
# or
pnpm add @abdosaiko20/tg-sdk
🚀 Quick Start
Bot API with Polling
typescript
import { BotClient, inlineKeyboard, markdown } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: 'YOUR_BOT_TOKEN' });

// Handle updates
bot.on('message', async (msg) => {
  if (msg.text === '/start') {
    const keyboard = inlineKeyboard()
      .text('Button 1', 'btn1')
      .url('Website', 'https://example.com')
      .row()
      .text('Button 2', 'btn2')
      .build();
    
    const md = markdown()
      .bold('Welcome!')
      .text(' Choose an option:')
      .toString();

    await bot.sendMessage(msg.chat.id, md, {
      parse_mode: 'MarkdownV2',
      reply_markup: keyboard
    });
  }
});

// Start polling
bot.startPolling();
Bot API with Webhook
typescript
import { BotClient } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: 'YOUR_BOT_TOKEN' });

// Set webhook
await bot.setWebhook('https://example.com/webhook', {
  secret_token: 'my-secret-token'
});

// Start webhook server
await bot.startWebhook({
  port: 3000,
  path: '/webhook',
  secretToken: 'my-secret-token'
});

// Handle updates
bot.on('message', async (msg) => {
  await bot.sendMessage(msg.chat.id, 'Hello!');
});
Router Example
typescript
import { BotClient, Router, Context } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: 'TOKEN' });
const router = new Router();

// Command handler
router.command('start', async (ctx) => {
  const c = ctx as Context;
  await c.reply('Welcome to the bot!');
});

// Text handler
router.hears('hello', async (ctx) => {
  const c = ctx as Context;
  await c.reply('Hi there! 👋');
});

// Regex handler
router.hears(/age (\d+)/, async (ctx) => {
  const c = ctx as Context;
  const age = c.match?.[1];
  await c.reply(`You are ${age} years old`);
});

// Callback query handler
router.action('delete', async (ctx) => {
  const c = ctx as Context;
  await c.delete();
  await c.answer('Deleted!');
});

// Event handler
router.event('chat_member', async (ctx) => {
  const c = ctx as Context;
  console.log('Chat member updated:', c.update);
});

// Connect to bot
bot.on('message', async (update) => {
  const ctx = new Context({ update_id: 0, message: update } as any, bot);
  await router.middleware()(ctx, async () => {
    // Default handler
    await bot.sendMessage(ctx.chatId!, 'Command not recognized');
  });
});

bot.startPolling();
Mini Apps
typescript
import tg from '@abdosaiko20/tg-sdk';

// Initialize
tg.ready();
tg.expand();

// Get user info
const user = tg.user();
console.log(`Hello, ${user?.first_name}!`);

// Theme
const isDark = tg.isDark();

// Main Button
tg.MainButton.setText('Submit');
tg.MainButton.show();
tg.MainButton.onClick(() => {
  tg.sendData(JSON.stringify({ action: 'submit' }));
});

// Popup
const result = await tg.showConfirm('Are you sure?');

// Haptic Feedback
tg.HapticFeedback.notificationOccurred('success');

// Cloud Storage
await tg.CloudStorage.set('theme', 'dark');
const theme = await tg.CloudStorage.get('theme');
React Hooks
tsx
import {
  useTelegram,
  useTelegramUser,
  useTelegramTheme,
  useTelegramMainButton,
  useTelegramViewport,
  useTelegramPopup,
  useTelegramHapticFeedback,
} from '@abdosaiko20/tg-sdk/react';

function App() {
  const { isTelegram, isMiniApp } = useTelegram();
  const user = useTelegramUser();
  const { isDark, params } = useTelegramTheme();
  const mainButton = useTelegramMainButton();
  const viewport = useTelegramViewport();
  const popup = useTelegramPopup();
  const haptic = useTelegramHapticFeedback();

  useEffect(() => {
    if (isMiniApp) {
      mainButton.setText('Play Game');
      mainButton.show();
      mainButton.onClick(async () => {
        haptic.impactOccurred('medium');
        const confirmed = await popup.confirm('Start game?');
        if (confirmed) {
          // Start game logic
        }
      });
    }
  }, [isMiniApp]);

  if (!isTelegram) {
    return <div>Please open in Telegram</div>;
  }

  return (
    <div style={{
      backgroundColor: isDark ? params.bg_color : '#fff',
      color: isDark ? params.text_color : '#000',
      height: viewport.height,
      padding: '20px'
    }}>
      <h1>Welcome, {user?.first_name || 'User'}!</h1>
      <p>Platform: {platform}</p>
    </div>
  );
}
Next.js App Router
tsx
// app/page.tsx
'use client';
import { useTelegramUser, useTelegramTheme } from '@abdosaiko20/tg-sdk/react';

export default function Home() {
  const user = useTelegramUser();
  const { isDark } = useTelegramTheme();

  return (
    <main style={{ color: isDark ? '#fff' : '#000' }}>
      <h1>Hello, {user?.first_name || 'Guest'}!</h1>
    </main>
  );
}
Next.js Route Handler (Bot Webhook)
typescript
// app/api/telegram/route.ts
import { BotClient } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: process.env.BOT_TOKEN! });

bot.on('message', async (msg) => {
  await bot.sendMessage(msg.chat.id, 'Hello from Next.js!');
});

export async function POST(request: Request) {
  const update = await request.json();
  // Process update
  return Response.json({ ok: true });
}
Broadcast Messages
typescript
const results = await bot.broadcast(
  'sendMessage',
  { text: 'Important announcement!' },
  {
    chatIds: [123456, 789012, 345678],
    concurrency: 10,
    delay: 500,
    stopOnError: false,
    onStart: (total) => console.log(`Starting broadcast to ${total} users`),
    onProgress: (current, total) => {
      console.log(`Progress: ${current}/${total}`);
    },
    onSuccess: (chatId) => console.log(`Sent to ${chatId}`),
    onError: (chatId, error) => console.error(`Failed for ${chatId}:`, error),
    onFinish: (results) => {
      const success = results.filter(r => r.success).length;
      console.log(`Completed: ${success}/${results.length} successful`);
    }
  }
);
Telegram Stars (Payments)
typescript
// Create Stars invoice
const invoiceLink = await bot.createStarsInvoice({
  title: 'Premium Access',
  description: 'Get premium features for 1 month',
  payload: 'premium_monthly',
  prices: [{ label: 'Premium', amount: 100 }],
  max_tip_amount: 200,
  suggested_tip_amounts: [100, 150, 200],
  photo_url: 'https://example.com/premium.jpg',
  need_name: true,
  need_email: true,
});

// Send Stars invoice directly
await bot.sendStarsInvoice(chatId, {
  title: 'Premium Access',
  description: 'Get premium features',
  payload: 'premium_monthly',
  prices: [{ label: 'Premium', amount: 100 }],
});

// Handle pre-checkout
bot.on('pre_checkout_query', async (query) => {
  await bot.answerPreCheckoutQuery(query.id, true);
});

// Refund payment
await bot.refundStarPayment(userId, 'charge_id');
Sessions
typescript
import { BotClient, SessionManager, Context } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: 'TOKEN' });
const session = new SessionManager();

// Custom storage adapter
const session = new SessionManager({
  get: async (key) => {
    // Get from Redis, database, etc.
    return JSON.parse(await redis.get(key) || 'null');
  },
  set: async (key, data) => {
    await redis.set(key, JSON.stringify(data));
  },
  delete: async (key) => {
    await redis.del(key);
  }
});

bot.use(session.middleware());

bot.on('message', async (update) => {
  const ctx = new Context({ update_id: 0, message: update } as any, bot);
  ctx.session = ctx.session || {};
  ctx.session.count = (ctx.session.count || 0) + 1;
  await ctx.reply(`Message count: ${ctx.session.count}`);
});

bot.startPolling();
Plugins
typescript
import { PluginSystem } from '@abdosaiko20/tg-sdk';

const plugins = new PluginSystem();

// Logger plugin
plugins.use(async (ctx, next) => {
  console.log('Update received:', ctx.update);
  const start = Date.now();
  await next();
  console.log(`Processing took ${Date.now() - start}ms`);
});

// Rate limit plugin
plugins.use(async (ctx, next) => {
  const userId = (ctx as any).user?.id;
  // Rate limit logic here
  await next();
});

bot.use(plugins.middleware());
📚 API Reference
BotClient
typescript
const bot = new BotClient({
  token: 'YOUR_BOT_TOKEN',
  baseUrl?: 'https://api.telegram.org', // Optional
  timeout?: 30000, // Optional
  retry?: {
    maxRetries: 3,
    retryDelay: 1000,
    retryOn: [429, 500, 502, 503, 504]
  }
});
Message Methods
sendMessage(chatId, text, options?) - Send text message

sendPhoto(chatId, photo, options?) - Send photo

sendVideo(chatId, video, options?) - Send video

sendAudio(chatId, audio, options?) - Send audio

sendDocument(chatId, document, options?) - Send document

sendAnimation(chatId, animation, options?) - Send animation

sendVoice(chatId, voice, options?) - Send voice

sendVideoNote(chatId, videoNote, options?) - Send video note

sendMediaGroup(chatId, media, options?) - Send media group

sendLocation(chatId, latitude, longitude, options?) - Send location

sendVenue(chatId, latitude, longitude, title, address, options?) - Send venue

sendContact(chatId, phone, firstName, options?) - Send contact

sendPoll(chatId, question, options, config?) - Send poll

sendDice(chatId, options?) - Send dice

sendChatAction(chatId, action) - Send chat action

Edit Methods
editMessageText(chatId, messageId, text, options?) - Edit text

editMessageCaption(chatId, messageId, options?) - Edit caption

editMessageMedia(chatId, messageId, media, options?) - Edit media

editMessageReplyMarkup(chatId, messageId, options?) - Edit reply markup

Other Methods
deleteMessage(chatId, messageId) - Delete message

forwardMessage(chatId, fromChatId, messageId) - Forward message

copyMessage(chatId, fromChatId, messageId, options?) - Copy message

pinChatMessage(chatId, messageId) - Pin message

unpinChatMessage(chatId, messageId?) - Unpin message

getMe() - Get bot info

getFile(fileId) - Get file info

downloadFile(fileIdOrPath) - Download file

Chat Methods
getChat(chatId) - Get chat info

banChatMember(chatId, userId) - Ban member

unbanChatMember(chatId, userId) - Unban member

restrictChatMember(chatId, userId, permissions) - Restrict member

promoteChatMember(chatId, userId, options) - Promote member

setChatPermissions(chatId, permissions) - Set permissions

exportChatInviteLink(chatId) - Export invite link

createChatInviteLink(chatId, options) - Create invite link

Payment Methods
sendInvoice(chatId, title, description, payload, prices, options?) - Send invoice

createInvoiceLink(title, description, payload, prices, options?) - Create invoice link

answerShippingQuery(shippingQueryId, ok, options?) - Answer shipping query

answerPreCheckoutQuery(preCheckoutQueryId, ok, options?) - Answer pre-checkout

createStarsInvoice(params) - Create Stars invoice

sendStarsInvoice(chatId, params) - Send Stars invoice

refundStarPayment(userId, chargeId) - Refund Stars payment

Keyboard Builders
typescript
// Inline Keyboard
const inline = inlineKeyboard()
  .text('Button', 'callback_data')
  .url('Website', 'https://example.com')
  .webApp('Open App', 'https://app.example.com')
  .login('Login', { url: 'https://login.example.com' })
  .switchInline('Share', 'query')
  .switchInlineCurrentChat('Share Here', 'query')
  .pay('Pay 100 Stars')
  .row()
  .build();

// Reply Keyboard
const reply = replyKeyboard()
  .text('Option 1')
  .text('Option 2')
  .row()
  .requestContact('Share Contact')
  .requestLocation('Share Location')
  .requestPoll('Create Poll')
  .webApp('Open Mini App', 'https://app.example.com')
  .resize()
  .oneTime()
  .placeholder('Choose an option...')
  .build();

// Remove keyboard
removeKeyboard();

// Force reply
forceReply('Enter your name...');
Markdown & HTML Builders
typescript
// MarkdownV2
const md = markdown()
  .bold('Bold text')
  .italic('Italic text')
  .underline('Underlined')
  .strikethrough('Strikethrough')
  .spoiler('Spoiler!')
  .code('inline code')
  .pre('const x = 1;', 'typescript')
  .quote('Quote text')
  .link('Click here', 'https://example.com')
  .mention('User', 123456789)
  .text(' Normal text')
  .toString();

// HTML
const h = html()
  .bold('Bold')
  .italic('Italic')
  .underline('Underlined')
  .strikethrough('Strikethrough')
  .spoiler('Spoiler')
  .code('code')
  .pre('const x = 1;', 'javascript')
  .link('Link', 'https://example.com')
  .toString();
React Hooks
useTelegram() - Get WebApp instance and platform info

useTelegramUser() - Get current user

useTelegramTheme() - Get theme params and dark mode

useTelegramMainButton() - Control main button

useTelegramBackButton() - Control back button

useTelegramSettingsButton() - Control settings button

useTelegramViewport() - Get viewport info

useTelegramPopup() - Show popups/alerts/confirms

useTelegramHapticFeedback() - Haptic feedback controls

useTelegramCloudStorage() - Cloud storage with loading state

useTelegramClipboard() - Read/write clipboard

useTelegramEvent(event, callback) - Listen to events

🌐 Platform Support
✅ Node.js 18, 20, 22

✅ Deno

✅ Bun

✅ Cloudflare Workers

✅ Vercel Edge Runtime

✅ React 16.8+

✅ Next.js 13+ (App Router & Pages Router)

✅ Vue 3

✅ Svelte / SvelteKit

✅ Angular 12+

✅ Nuxt 3

🤝 Contributing
Contributions are welcome! Please read our contributing guidelines before submitting PRs.

📄 License
MIT © @abdosaiko20/tg-sdk team

🔗 Links
GitHub Repository

Issue Tracker

Telegram Bot API Docs

Telegram Mini Apps Docs