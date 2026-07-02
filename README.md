<p align="center">
  <img src="https://i.postimg.cc/tRMw2ngv/Telegram-Logo-700x394.png" alt="@abdosaiko20/tg-sdk" width="200"/>
</p>

<h1 align="center">@abdosaiko20/tg-sdk</h1>

<p align="center">
  <strong>🚀 Lightweight, Production-Ready, Comprehensive Telegram SDK</strong>
</p>

<p align="center">
  <em>Build powerful Telegram Bots & Mini Apps with elegance and speed</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@abdosaiko20/tg-sdk">
    <img src="https://img.shields.io/npm/v/@abdosaiko20/tg-sdk.svg?style=flat-square" alt="npm version"/>
  </a>
  <a href="https://www.npmjs.com/package/@abdosaiko20/tg-sdk">
    <img src="https://img.shields.io/npm/dm/@abdosaiko20/tg-sdk.svg?style=flat-square" alt="npm downloads"/>
  </a>
  <a href="https://bundlephobia.com/package/@abdosaiko20/tg-sdk">
    <img src="https://img.shields.io/bundlephobia/minzip/@abdosaiko20/tg-sdk?style=flat-square" alt="bundle size"/>
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT"/>
  </a>
  <a href="https://github.com/abdosaiko20/tg-sdk/stargazers">
    <img src="https://img.shields.io/github/stars/abdosaiko20/tg-sdk?style=flat-square" alt="Stars"/>
  </a>
</p>

<p align="center">
  <a href="https://t.me/abdosaiko20">
    <img src="https://img.shields.io/badge/Telegram-@abdosaiko20-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"/>
  </a>
---

## 🌟 Why @abdosaiko20/tg-sdk?

<table>
  <tr>
    <td width="50%">
      <h3>🎯 Complete & Comprehensive</h3>
      <p>Every single Telegram Bot API method, every Mini App feature, every keyboard type - all in one lightweight package with <strong>zero runtime dependencies</strong>.</p>
    </td>
    <td width="50%">
      <h3>⚡ Blazing Fast</h3>
      <p>Built on modern ES2022, tree-shakeable, with automatic retries, rate limiting, and connection pooling out of the box.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>💪 Fully Typed</h3>
      <p>Complete TypeScript definitions for every function, parameter, and response. Enjoy autocomplete and type safety everywhere.</p>
    </td>
    <td>
      <h3>🌍 Universal</h3>
      <p>Runs everywhere: Node.js, Deno, Bun, Cloudflare Workers, Vercel Edge, React, Next.js, Vue, Svelte, Angular, and more.</p>
    </td>
  </tr>
</table>

---

## 📦 Installation

```bash
# npm
npm install @abdosaiko20/tg-sdk

# yarn
yarn add @abdosaiko20/tg-sdk

# pnpm
pnpm add @abdosaiko20/tg-sdk

# bun
bun add @abdosaiko20/tg-sdk
```

---

## 🏗️ Architecture

```
@abdosaiko20/tg-sdk/
├── 🤖 Bot API          →  Full Telegram Bot API with 100+ methods
├── 📱 Mini Apps        →  Complete WebApp API for Telegram Mini Apps
├── 🎨 Keyboards        →  Fluent builders for Inline & Reply keyboards
├── 📝 Formatters       →  MarkdownV2 & HTML safe builders
├── 🔄 Middleware        →  Express-like middleware engine
├── 🛣️ Router           →  Command, hears, action, event routing
├── 💾 Sessions          →  Built-in session with custom storage adapters
├── 🔌 Plugins          →  Extensible plugin architecture
├── ⭐ Payments          →  Telegram Stars & invoice management
├── 📡 Broadcast        →  Message broadcasting with concurrency control
└── ⚛️ React             →  First-class React hooks
```

---

## 🚀 Quick Start

### 🤖 Telegram Bot (Polling)

```typescript
import { BotClient, inlineKeyboard, markdown } from '@abdosaiko20/tg-sdk';

// Initialize bot
const bot = new BotClient({ 
  token: 'YOUR_BOT_TOKEN'
});

// Handle /start command
bot.on('message', async (msg) => {
  if (msg.text === '/start') {
    // Create beautiful inline keyboard
    const keyboard = inlineKeyboard()
      .text('🚀 Get Started', 'start')
      .url('🌐 Website', 'https://example.com')
      .row()
      .text('ℹ️ Help', 'help')
      .text('⭐ Premium', 'premium')
      .build();
    
    // Build formatted message
    const welcomeMsg = markdown()
      .bold('Welcome to My Bot!')
      .newLine()
      .text('Choose an option below:')
      .toString();

    await bot.sendMessage(msg.chat.id, welcomeMsg, {
      parse_mode: 'MarkdownV2',
      reply_markup: keyboard
    });
  }
});

// Start polling for updates
bot.startPolling();
console.log('🤖 Bot is running...');
```

### 🌐 Telegram Bot (Webhook)

```typescript
import { BotClient, Router, Context } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: process.env.BOT_TOKEN! });
const router = new Router();

// Define routes
router.command('start', async (ctx) => {
  const c = ctx as Context;
  await c.replyWithMarkdown(
    markdown()
      .bold('Welcome!')
      .newLine()
      .text('I am a webhook-powered bot.')
      .toString()
  );
});

router.hears(/hello|hi|hey/i, async (ctx) => {
  const c = ctx as Context;
  await c.reply(`Hello, ${c.user?.first_name || 'there'}! 👋`);
});

router.action('premium', async (ctx) => {
  const c = ctx as Context;
  await c.answer('Opening premium features...');
  await c.edit('🌟 Premium features unlocked!');
});

// Connect router to bot
bot.on('message', async (update) => {
  const ctx = new Context({ update_id: 0, message: update } as any, bot);
  await router.middleware()(ctx, async () => {
    await bot.sendMessage(ctx.chatId!, 'Command not recognized. Try /start');
  });
});

// Setup webhook
await bot.setWebhook('https://your-domain.com/api/telegram', {
  secret_token: 'your-secret-token'
});

// Start webhook server
await bot.startWebhook({ 
  port: 3000, 
  path: '/api/telegram',
  secretToken: 'your-secret-token'
});

console.log('🌐 Webhook server running on port 3000');
```

### 📱 Telegram Mini App

```typescript
import tg from '@abdosaiko20/tg-sdk';

// Initialize Mini App
tg.ready();
tg.expand();

// Get user information
const user = tg.user();
console.log(`👤 User: ${user?.first_name} ${user?.last_name}`);

// Theme support
const isDark = tg.isDark();
document.body.className = isDark ? 'dark-theme' : 'light-theme';

// Main Button with progress
tg.MainButton.setText('💾 Save Settings');
tg.MainButton.setColor('#4CAF50');
tg.MainButton.setTextColor('#FFFFFF');
tg.MainButton.show();

tg.MainButton.onClick(async () => {
  tg.MainButton.showProgress();
  
  try {
    // Save to cloud storage
    await tg.CloudStorage.set('settings', JSON.stringify({
      theme: isDark ? 'dark' : 'light',
      notifications: true
    }));
    
    tg.HapticFeedback.notificationOccurred('success');
    await tg.showAlert('✅ Settings saved successfully!');
  } catch (error) {
    tg.HapticFeedback.notificationOccurred('error');
    await tg.showAlert('❌ Failed to save settings');
  } finally {
    tg.MainButton.hideProgress();
  }
});

// Back button
tg.BackButton.show();
tg.BackButton.onClick(() => {
  tg.close();
});
```

### ⚛️ React Integration

```tsx
import { useState } from 'react';
import {
  useTelegram,
  useTelegramUser,
  useTelegramTheme,
  useTelegramMainButton,
  useTelegramPopup,
  useTelegramHapticFeedback,
} from '@abdosaiko20/tg-sdk/react';

export default function MiniApp() {
  const { isMiniApp, platform } = useTelegram();
  const user = useTelegramUser();
  const { isDark, params } = useTelegramTheme();
  const mainButton = useTelegramMainButton();
  const popup = useTelegramPopup();
  const haptic = useTelegramHapticFeedback();
  const [count, setCount] = useState(0);

  // Configure main button
  useEffect(() => {
    if (isMiniApp) {
      mainButton.setText(`🎯 Clicks: ${count}`);
      mainButton.setColor(isDark ? '#8774E1' : '#6C5CE7');
      mainButton.show();
      
      mainButton.onClick(async () => {
        haptic.impactOccurred('light');
        setCount(prev => prev + 1);
        
        if (count >= 10) {
          const confirmed = await popup.confirm('🏆 Reset counter?');
          if (confirmed) setCount(0);
        }
      });
    }
  }, [isMiniApp, count, isDark]);

  if (!isMiniApp) {
    return <div>Please open in Telegram</div>;
  }

  return (
    <div style={{
      backgroundColor: isDark ? params.bg_color : '#FFFFFF',
      color: isDark ? params.text_color : '#000000',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 8px' }}>
          👋 Hello, {user?.first_name || 'User'}!
        </h1>
        <p style={{ opacity: 0.7 }}>
          Platform: {platform} • Theme: {isDark ? '🌙 Dark' : '☀️ Light'}
        </p>
      </header>

      <main style={{ textAlign: 'center' }}>
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '4rem', margin: '0' }}>{count}</h2>
          <p style={{ opacity: 0.6 }}>Button Clicks</p>
        </div>
      </main>
    </div>
  );
}
```

---

## 💰 Telegram Stars (Payments)

```typescript
import { BotClient } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: 'YOUR_BOT_TOKEN' });

// Handle invoice creation
bot.on('message', async (msg) => {
  if (msg.text === '/premium') {
    await bot.sendStarsInvoice(msg.chat.id, {
      title: '⭐ Premium Access',
      description: 'Unlock all premium features for 1 month',
      payload: 'premium_monthly',
      prices: [{ label: 'Premium', amount: 100 }],
      max_tip_amount: 200,
      suggested_tip_amounts: [100, 150, 200],
      photo_url: 'https://example.com/premium-banner.jpg',
      need_name: true,
      need_email: true,
    });
  }
});

// Handle pre-checkout
bot.on('pre_checkout_query', async (query) => {
  await bot.answerPreCheckoutQuery(query.id, true);
});

// Handle successful payment
bot.on('message', async (msg) => {
  if (msg.successful_payment) {
    await bot.sendMessage(
      msg.chat.id,
      '🎉 Thank you for your purchase! Premium features activated.'
    );
    
    // Refund example (if needed)
    // await bot.refundStarPayment(
    //   msg.from!.id,
    //   msg.successful_payment.telegram_payment_charge_id
    // );
  }
});
```

---

## 📡 Broadcast System

```typescript
const results = await bot.broadcast(
  'sendMessage',
  { 
    text: '🔔 Important Announcement!',
    parse_mode: 'HTML'
  },
  {
    chatIds: [123456789, 987654321, 555555555],
    concurrency: 10,
    delay: 500,
    stopOnError: false,
    onStart: (total) => {
      console.log(`📡 Broadcasting to ${total} users...`);
    },
    onProgress: (current, total) => {
      const percent = ((current / total) * 100).toFixed(1);
      console.log(`Progress: ${current}/${total} (${percent}%)`);
    },
    onSuccess: (chatId, result) => {
      console.log(`✅ Sent to ${chatId}`);
    },
    onError: (chatId, error) => {
      console.error(`❌ Failed for ${chatId}:`, error.message);
    },
    onFinish: (results) => {
      const success = results.filter(r => r.success).length;
      const failed = results.length - success;
      console.log(`
📊 Broadcast Complete:
  ✅ Success: ${success}
  ❌ Failed: ${failed}
  📈 Success Rate: ${((success / results.length) * 100).toFixed(1)}%
      `);
    }
  }
);
```

---

## 🔧 Advanced Examples

### Session Management with Redis

```typescript
import { BotClient, SessionManager, Context } from '@abdosaiko20/tg-sdk';
import Redis from 'ioredis';

const redis = new Redis();
const bot = new BotClient({ token: 'TOKEN' });

// Redis session storage
const session = new SessionManager({
  get: async (key) => {
    const data = await redis.get(`session:${key}`);
    return data ? JSON.parse(data) : null;
  },
  set: async (key, data) => {
    await redis.set(`session:${key}`, JSON.stringify(data), 'EX', 3600);
  },
  delete: async (key) => {
    await redis.del(`session:${key}`);
  }
});

// Apply session middleware
bot.use(session.middleware());

// Use sessions in handlers
bot.on('message', async (update) => {
  const ctx = new Context({ update_id: 0, message: update } as any, bot);
  
  // Initialize session
  ctx.session = ctx.session || {};
  ctx.session.visits = (ctx.session.visits || 0) + 1;
  ctx.session.lastVisit = Date.now();
  
  await ctx.reply(
    `📊 Visit #${ctx.session.visits}\n` +
    `🕐 Last visit: ${new Date(ctx.session.lastVisit).toLocaleString()}`
  );
});

bot.startPolling();
```

### Custom Plugin System

```typescript
import { PluginSystem, MiddlewareContext } from '@abdosaiko20/tg-sdk';

const plugins = new PluginSystem();

// Analytics plugin
plugins.use(async (ctx: MiddlewareContext, next) => {
  const startTime = Date.now();
  const user = (ctx as any).user;
  
  console.log(`📊 [Analytics] User ${user?.id} started`);
  
  await next();
  
  const duration = Date.now() - startTime;
  console.log(`📊 [Analytics] Completed in ${duration}ms`);
  
  // Send to your analytics service
  await fetch('https://analytics.example.com/track', {
    method: 'POST',
    body: JSON.stringify({
      userId: user?.id,
      duration,
      timestamp: Date.now()
    })
  });
});

// Rate limiter plugin
plugins.use(async (ctx: MiddlewareContext, next) => {
  const user = (ctx as any).user;
  const userId = user?.id?.toString() || 'anonymous';
  
  // Simple in-memory rate limiting
  const key = `rate_limit:${userId}`;
  const requests = (globalThis as any).__rateLimitCache?.get(key) || 0;
  
  if (requests > 30) {
    throw new Error('Rate limit exceeded');
  }
  
  if (!(globalThis as any).__rateLimitCache) {
    (globalThis as any).__rateLimitCache = new Map();
  }
  
  (globalThis as any).__rateLimitCache.set(key, requests + 1);
  setTimeout(() => {
    (globalThis as any).__rateLimitCache.delete(key);
  }, 60000);
  
  await next();
});

// Apply plugins
bot.use(plugins.middleware());
```

### Next.js Route Handler (Full Example)

```typescript
// app/api/telegram/route.ts
import { BotClient, Router, Context } from '@abdosaiko20/tg-sdk';
import { NextResponse } from 'next/server';

const bot = new BotClient({ token: process.env.TELEGRAM_BOT_TOKEN! });
const router = new Router();

// Setup routes
router.command('start', async (ctx) => {
  const c = ctx as Context;
  await c.reply('Welcome to Next.js Telegram Bot! 🚀');
});

router.hears('status', async (ctx) => {
  const c = ctx as Context;
  const me = await bot.getMe();
  await c.reply(`Bot Status:\n• Name: ${me.first_name}\n• Username: @${me.username}`);
});

// Webhook handler
export async function POST(request: Request) {
  try {
    const update = await request.json();
    
    // Create context and process
    const ctx = new Context(update, bot);
    await router.middleware()(ctx, async () => {
      // Default handler
      if (update.message?.chat?.id) {
        await bot.sendMessage(update.message.chat.id, 'Command not recognized');
      }
    });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Webhook setup
export async function GET() {
  const webhookUrl = `${process.env.VERCEL_URL}/api/telegram`;
  
  await bot.setWebhook(webhookUrl, {
    secret_token: process.env.WEBHOOK_SECRET
  });
  
  return NextResponse.json({ 
    ok: true, 
    webhook: webhookUrl 
  });
}
```

---

## 📚 Complete API Reference

### BotClient Methods

<details>
<summary><strong>📨 Message Methods</strong></summary>

| Method | Description | Options |
|--------|-------------|---------|
| `sendMessage(chatId, text, options?)` | Send text message | `parse_mode`, `reply_markup`, `disable_notification`, etc. |
| `sendPhoto(chatId, photo, options?)` | Send photo | `caption`, `has_spoiler`, `reply_markup` |
| `sendVideo(chatId, video, options?)` | Send video | `duration`, `width`, `height`, `supports_streaming` |
| `sendAudio(chatId, audio, options?)` | Send audio | `performer`, `title`, `thumbnail` |
| `sendDocument(chatId, document, options?)` | Send document | `thumbnail`, `disable_content_type_detection` |
| `sendAnimation(chatId, animation, options?)` | Send animation/GIF | `duration`, `has_spoiler` |
| `sendVoice(chatId, voice, options?)` | Send voice note | `duration` |
| `sendVideoNote(chatId, videoNote, options?)` | Send video note | `duration`, `length` |
| `sendMediaGroup(chatId, media, options?)` | Send media group | Array of `InputMedia` |
| `sendLocation(chatId, lat, lon, options?)` | Send location | `live_period`, `heading` |
| `sendVenue(chatId, lat, lon, title, addr)` | Send venue | `foursquare_id`, `google_place_id` |
| `sendContact(chatId, phone, name, options?)` | Send contact | `vcard` |
| `sendPoll(chatId, question, options)` | Send poll | `type`, `allows_multiple_answers` |
| `sendDice(chatId, options?)` | Send dice/emoji | `emoji` (🎲, 🎯, 🏀, ⚽, 🎳, 🎰) |
| `sendSticker(chatId, sticker, options?)` | Send sticker | `emoji` |
| `sendChatAction(chatId, action)` | Send typing/broadcast action | `typing`, `upload_photo`, etc. |

</details>

<details>
<summary><strong>✏️ Edit & Delete Methods</strong></summary>

| Method | Description |
|--------|-------------|
| `editMessageText(chatId, msgId, text, options?)` | Edit message text |
| `editMessageCaption(chatId, msgId, options?)` | Edit media caption |
| `editMessageMedia(chatId, msgId, media)` | Edit message media |
| `editMessageReplyMarkup(chatId, msgId, markup)` | Edit inline keyboard |
| `deleteMessage(chatId, msgId)` | Delete message |
| `deleteMessages(chatId, msgIds[])` | Delete multiple messages |
| `stopPoll(chatId, msgId)` | Stop a running poll |

</details>

<details>
<summary><strong>👥 Chat Management</strong></summary>

| Method | Description |
|--------|-------------|
| `getChat(chatId)` | Get chat information |
| `getChatAdministrators(chatId)` | Get chat admins |
| `getChatMemberCount(chatId)` | Get member count |
| `getChatMember(chatId, userId)` | Get specific member |
| `banChatMember(chatId, userId)` | Ban member |
| `unbanChatMember(chatId, userId)` | Unban member |
| `restrictChatMember(chatId, userId, perms)` | Restrict member |
| `promoteChatMember(chatId, userId, opts)` | Promote to admin |
| `setChatPermissions(chatId, permissions)` | Set default permissions |
| `setChatTitle(chatId, title)` | Change chat title |
| `setChatDescription(chatId, desc)` | Change description |
| `setChatPhoto(chatId, photo)` | Change chat photo |
| `deleteChatPhoto(chatId)` | Remove chat photo |
| `pinChatMessage(chatId, msgId)` | Pin message |
| `unpinChatMessage(chatId, msgId?)` | Unpin message |
| `leaveChat(chatId)` | Bot leaves chat |

</details>

<details>
<summary><strong>💰 Payments & Stars</strong></summary>

| Method | Description |
|--------|-------------|
| `sendInvoice(chatId, ...)` | Send payment invoice |
| `createInvoiceLink(...)` | Create invoice link |
| `answerShippingQuery(id, ok, opts)` | Answer shipping query |
| `answerPreCheckoutQuery(id, ok, opts)` | Answer pre-checkout |
| `createStarsInvoice(params)` | Create Stars invoice link |
| `sendStarsInvoice(chatId, params)` | Send Stars invoice |
| `refundStarPayment(userId, chargeId)` | Refund Stars payment |

</details>

<details>
<summary><strong>🔧 Webhook & Polling</strong></summary>

| Method | Description |
|--------|-------------|
| `startPolling(options?)` | Start long polling |
| `stopPolling()` | Stop polling |
| `setWebhook(url, options?)` | Set webhook URL |
| `deleteWebhook(options?)` | Remove webhook |
| `getWebhookInfo()` | Get webhook status |
| `startWebhook(options?)` | Start webhook server |
| `stopWebhook()` | Stop webhook server |

</details>

---

## 🎨 Keyboard Builders

### Inline Keyboard

```typescript
import { inlineKeyboard } from '@abdosaiko20/tg-sdk';

const keyboard = inlineKeyboard()
  .text('🚀 Action', 'action_1')
  .url('🌐 Visit Site', 'https://example.com')
  .row()
  .webApp('📱 Open App', 'https://app.example.com')
  .login('🔑 Login', { url: 'https://auth.example.com' })
  .row()
  .switchInline('📤 Share', 'check this out')
  .switchInlineCurrentChat('💬 Share Here', 'look')
  .row()
  .pay('⭐ Pay 100 Stars')
  .build();
```

### Reply Keyboard

```typescript
import { replyKeyboard, removeKeyboard, forceReply } from '@abdosaiko20/tg-sdk';

const keyboard = replyKeyboard()
  .text('📊 Stats')
  .text('⚙️ Settings')
  .row()
  .requestContact('📞 Share Contact')
  .requestLocation('📍 Share Location')
  .row()
  .requestPoll('📋 Create Poll')
  .webApp('🚀 Launch App', 'https://app.example.com')
  .resize()
  .oneTime()
  .placeholder('Choose an option...')
  .build();

// Remove keyboard
const remove = removeKeyboard();

// Force reply
const force = forceReply('Enter your name...');
```

---

## 📝 Formatters

### MarkdownV2

```typescript
import { markdown, ParseMode } from '@abdosaiko20/tg-sdk';

const message = markdown()
  .bold('Important Announcement')
  .newLine()
  .newLine()
  .text('We are excited to share ')
  .italic('amazing news')
  .text(' with you!')
  .newLine()
  .newLine()
  .spoiler('Spoiler: Something big is coming!')
  .newLine()
  .newLine()
  .link('👉 Learn More', 'https://example.com')
  .toString();

await bot.sendMessage(chatId, message, {
  parse_mode: ParseMode.MarkdownV2
});
```

### HTML

```typescript
import { html } from '@abdosaiko20/tg-sdk';

const message = html()
  .bold('Welcome!')
  .newLine()
  .text('This is ')
  .italic('italic')
  .text(' and this is ')
  .underline('underlined')
  .text('.')
  .newLine()
  .newLine()
  .pre('const greeting = "Hello World";\nconsole.log(greeting);', 'javascript')
  .newLine()
  .link('🔗 Documentation', 'https://docs.example.com')
  .toString();

await bot.sendMessage(chatId, message, {
  parse_mode: 'HTML'
});
```

---

## ⚛️ React Hooks Reference

| Hook | Description | Returns |
|------|-------------|---------|
| `useTelegram()` | Core Telegram info | `{ isTelegram, isMiniApp, platform, version }` |
| `useTelegramUser()` | Current user data | `TelegramUser \| null` |
| `useTelegramTheme()` | Theme information | `{ params, isDark }` |
| `useTelegramMainButton()` | Main button controls | `{ show, hide, setText, onClick, ... }` |
| `useTelegramBackButton()` | Back button controls | `{ show, hide, onClick }` |
| `useTelegramSettingsButton()` | Settings button | `{ show, hide, onClick }` |
| `useTelegramViewport()` | Viewport info | `{ height, width, isExpanded, ... }` |
| `useTelegramPopup()` | Popup dialogs | `{ show, alert, confirm }` |
| `useTelegramHapticFeedback()` | Haptic feedback | `{ impactOccurred, notificationOccurred }` |
| `useTelegramCloudStorage()` | Cloud storage | `{ get, set, remove, loading, error }` |
| `useTelegramClipboard()` | Clipboard access | `{ copy, read }` |
| `useTelegramEvent(event, cb)` | Event listener | `void` |

---

## 🌐 Platform Support

| Platform | Support | Notes |
|----------|---------|-------|
| **Node.js** 18+ | ✅ Full | All features supported |
| **Node.js** 20+ | ✅ Full | Recommended |
| **Node.js** 22+ | ✅ Full | Latest LTS |
| **Deno** | ✅ Full | Import from npm |
| **Bun** | ✅ Full | Native support |
| **Cloudflare Workers** | ✅ | Webhook mode only |
| **Vercel Edge** | ✅ | Route handlers |
| **React** 16.8+ | ✅ | All hooks |
| **Next.js** 13+ | ✅ | App & Pages Router |
| **Vue 3** | ✅ | Composition API |
| **Svelte/SvelteKit** | ✅ | Full support |
| **Angular 12+** | ✅ | Services |
| **Nuxt 3** | ✅ | Auto-import |

---

## 💖 Support the Project

<p align="center">
  <strong>If you find this SDK useful, please consider supporting its development:</strong>
</p>

<p align="center">
  <a href="https://t.me/abdosaiko20">
    <img src="https://img.shields.io/badge/📱_Telegram-@abdosaiko20-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"/>
  </a>
  &nbsp;&nbsp;
  <a href="#">
    <img src="https://img.shields.io/badge/💎_TON_Wallet-UQBhv7U7Jt_HH6S219IrqM4ARl6S-d_3xxgf5tbw5DgGsxch-0098EA?style=for-the-badge&logo=ton&logoColor=white" alt="TON Wallet"/>
  </a>
</p>

<p align="center">
  <strong>TON Wallet Address:</strong><br/>
  <code>UQBhv7U7Jt_HH6S219IrqM4ARl6S-d_3xxgf5tbw5DgGsxch</code>
</p>

<p align="center">
  ⭐ Star this repository if you find it useful!<br/>
  🐛 Report issues and suggest features<br/>
  🤝 Contributions are always welcome!
</p>

---

## 📄 License

MIT © [@abdosaiko20](https://github.com/saikomohamed144)

---

## 🔗 Links

- 📦 [NPM Package](https://www.npmjs.com/package/saikomohamed144/tg-sdk)
- 💻 [GitHub Repository](https://github.com/saikomohamed144/tg-sdk)
- 🐛 [Issue Tracker](https://github.com/saikomohamed144/tg-sdk/issues)
- 📖 [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- 📱 [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- 💎 [TON Blockchain](https://ton.org)

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://t.me/abdosaiko20">@abdosaiko20</a></sub>
</p>
