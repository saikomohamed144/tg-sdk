<p align="center">
  <img src="https://raw.githubusercontent.com/yourusername/tg-sdk/main/assets/logo.png" alt="TG SDK Logo" width="200" height="200">
</p>

<h1 align="center">@abdosaiko20/tg-sdk</h1>

<p align="center">
  <strong>Lightweight, Production-Ready Telegram SDK for Bots & Mini Apps</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@abdosaiko20/tg-sdk">
    <img src="https://img.shields.io/npm/v/@abdosaiko20/tg-sdk?color=blue&style=flat-square" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/@abdosaiko20/tg-sdk">
    <img src="https://img.shields.io/npm/dm/@abdosaiko20/tg-sdk?color=blue&style=flat-square" alt="npm downloads">
  </a>
  <a href="https://bundlephobia.com/package/@abdosaiko20/tg-sdk">
    <img src="https://img.shields.io/bundlephobia/minzip/@abdosaiko20/tg-sdk?style=flat-square" alt="bundle size">
  </a>
  <a href="https://github.com/yourusername/tg-sdk/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/yourusername/tg-sdk?color=blue&style=flat-square" alt="license">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.3+-3178C6?logo=typescript&logoColor=white&style=flat-square" alt="TypeScript">
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white&style=flat-square" alt="Node.js">
  </a>
  <a href="https://github.com/yourusername/tg-sdk/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/yourusername/tg-sdk/ci.yml?branch=main&style=flat-square" alt="CI">
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-examples">Examples</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 📖 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
  - [Bot API (Polling)](#bot-api-with-polling)
  - [Bot API (Webhook)](#bot-api-with-webhook)
  - [Mini Apps](#mini-apps)
  - [React Hooks](#react-hooks)
  - [Next.js Integration](#nextjs-integration)
- [Core Concepts](#-core-concepts)
  - [BotClient](#botclient)
  - [Router & Middleware](#router--middleware)
  - [Keyboard Builders](#keyboard-builders)
  - [Markdown & HTML Builders](#markdown--html-builders)
  - [Session Management](#session-management)
  - [Plugin System](#plugin-system)
- [Advanced Usage](#-advanced-usage)
  - [Broadcast System](#broadcast-system)
  - [Telegram Stars (Payments)](#telegram-stars-payments)
  - [File Handling](#file-handling)
  - [Error Handling](#error-handling)
  - [Rate Limiting](#rate-limiting)
- [API Reference](#-api-reference)
- [TypeScript Support](#-typescript-support)
- [Platform Support](#-platform-support)
- [Examples](#-examples)
- [Contributing](#-contributing)
- [Security](#-security)
- [FAQ](#-faq)
- [Changelog](#-changelog)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>🎯 Complete Bot API</h3>
      <p>Full coverage of Telegram Bot API with all methods, types, and features including messages, media, payments, games, stickers, and more.</p>
    </td>
    <td width="50%">
      <h3>📱 Mini Apps Support</h3>
      <p>Complete Telegram WebApp API integration with MainButton, BackButton, HapticFeedback, CloudStorage, Biometric auth, and more.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>⚡ Dual Update Methods</h3>
      <p>Built-in support for both <strong>Long Polling</strong> and <strong>Webhook</strong> with automatic retry and error recovery.</p>
    </td>
    <td>
      <h3>🎨 Fluent Builders</h3>
      <p>Elegant builder pattern for Inline Keyboards, Reply Keyboards, Markdown, and HTML with full type safety.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🔄 Middleware Engine</h3>
      <p>Express/Koa-style middleware system with Router supporting commands, text patterns, regex, callbacks, and events.</p>
    </td>
    <td>
      <h3>💾 Session Management</h3>
      <p>Built-in session support with custom storage adapters (Redis, MongoDB, SQL, file system, etc.).</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🔌 Plugin Architecture</h3>
      <p>Extensible plugin system for adding custom functionality, logging, rate limiting, analytics, etc.</p>
    </td>
    <td>
      <h3>⭐ Telegram Stars</h3>
      <p>Complete payment integration with Stars invoices, pre-checkout handling, and refund support.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>📡 Broadcast System</h3>
      <p>Efficient message broadcasting with configurable concurrency, delays, retry logic, and progress tracking.</p>
    </td>
    <td>
      <h3>⚛️ React Hooks</h3>
      <p>First-class React support with 15+ custom hooks for all Telegram features.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🔒 Type Safety</h3>
      <p>100% TypeScript with complete type definitions for all APIs, methods, and responses.</p>
    </td>
    <td>
      <h3>0️⃣ Zero Dependencies</h3>
      <p>No runtime dependencies. Minimal bundle size (~5KB gzipped). Fully tree-shakeable.</p>
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

### Optional Peer Dependencies

```bash
# For React hooks
npm install react

# For TypeScript types
npm install --save-dev @types/react
```

---

## 🚀 Quick Start

### Bot API with Polling

```typescript
import { BotClient } from '@abdosaiko20/tg-sdk';

// Initialize bot
const bot = new BotClient({
  token: 'YOUR_BOT_TOKEN',
  polling: {
    timeout: 30,
    allowedUpdates: ['message', 'callback_query']
  }
});

// Handle messages
bot.on('message', async (message) => {
  if (message.text === '/start') {
    await bot.sendMessage(message.chat.id, 'Welcome to the bot! 🚀');
  }
});

// Handle callback queries
bot.on('callback_query', async (query) => {
  await bot.answerCallbackQuery(query.id, {
    text: 'Button clicked!',
    show_alert: true
  });
});

// Start polling
await bot.startPolling();
console.log('Bot is running...');
```

### Bot API with Webhook

```typescript
import { BotClient } from '@abdosaiko20/tg-sdk';
import express from 'express';

const bot = new BotClient({ token: 'YOUR_BOT_TOKEN' });
const app = express();

// Handle updates
bot.on('message', async (message) => {
  await bot.sendMessage(message.chat.id, 'Hello from Webhook!');
});

// Express webhook endpoint
app.post('/webhook', async (req, res) => {
  const update = req.body;
  
  // Emit update to bot handlers
  bot.emit('update', update);
  
  // Or process directly
  if (update.message) {
    bot.emit('message', update.message);
  }
  
  res.json({ ok: true });
});

// Set webhook URL
await bot.setWebhook('https://your-domain.com/webhook', {
  secret_token: 'my-secret-token'
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

### Mini Apps

```typescript
import tg from '@abdosaiko20/tg-sdk';

// Initialize the Mini App
tg.ready();
tg.expand();

// Get current user
const user = tg.user();
console.log(`Hello, ${user?.first_name}!`);

// Check theme
const isDark = tg.isDark();
const colors = tg.theme();

// Main Button configuration
tg.MainButton.setText('Submit Order');
tg.MainButton.setColor('#4CAF50');
tg.MainButton.setTextColor('#FFFFFF');
tg.MainButton.show();

tg.MainButton.onClick(() => {
  tg.HapticFeedback.notificationOccurred('success');
  tg.sendData(JSON.stringify({
    action: 'submit_order',
    items: ['item1', 'item2']
  }));
});

// Show confirmation dialog
const confirmed = await tg.showConfirm('Are you sure you want to proceed?');
if (confirmed) {
  await tg.showAlert('Order submitted successfully!');
}

// Cloud Storage
await tg.CloudStorage.set('preferences', JSON.stringify({
  theme: 'dark',
  notifications: true
}));

const prefs = await tg.CloudStorage.get('preferences');
console.log('User preferences:', JSON.parse(prefs));
```

### React Hooks

```tsx
import React, { useEffect } from 'react';
import {
  useTelegram,
  useTelegramUser,
  useTelegramTheme,
  useTelegramMainButton,
  useTelegramPopup,
  useTelegramHapticFeedback,
  useTelegramCloudStorage,
} from '@abdosaiko20/tg-sdk/react';

function App() {
  const { isTelegram, isMiniApp, platform } = useTelegram();
  const user = useTelegramUser();
  const { isDark, params: themeColors } = useTelegramTheme();
  const mainButton = useTelegramMainButton();
  const popup = useTelegramPopup();
  const haptic = useTelegramHapticFeedback();
  const storage = useTelegramCloudStorage();

  useEffect(() => {
    if (isMiniApp) {
      // Configure Main Button
      mainButton.setText('Start Game 🎮');
      mainButton.setColor('#FF6B6B');
      mainButton.show();

      // Handle button click
      mainButton.onClick(async () => {
        haptic.impactOccurred('heavy');
        
        const confirmed = await popup.confirm('Ready to play?');
        if (confirmed) {
          await storage.set('gameState', 'started');
          // Start game logic
        }
      });
    }
  }, [isMiniApp]);

  if (!isTelegram) {
    return (
      <div style={styles.fallback}>
        <h2>Please open this app in Telegram</h2>
        <p>This is a Telegram Mini App</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: themeColors.bg_color || (isDark ? '#1a1a1a' : '#ffffff'),
      color: themeColors.text_color || (isDark ? '#ffffff' : '#000000'),
      minHeight: '100vh',
      padding: '20px',
    }}>
      <header>
        <h1>Welcome, {user?.first_name || 'User'}! 👋</h1>
        <p>Platform: {platform}</p>
        {user?.is_premium && <span>⭐ Premium User</span>}
      </header>

      <main>
        <div style={{
          backgroundColor: themeColors.secondary_bg_color || '#f0f0f0',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '20px',
        }}>
          <h2>Your Dashboard</h2>
          <p>Theme: {isDark ? '🌙 Dark' : '☀️ Light'}</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  fallback: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
};

export default App;
```

### Next.js Integration

#### App Router (Client Component)

```tsx
// app/page.tsx
'use client';

import { useTelegramUser, useTelegramTheme } from '@abdosaiko20/tg-sdk/react';

export default function HomePage() {
  const user = useTelegramUser();
  const { isDark } = useTelegramTheme();

  return (
    <main className={isDark ? 'dark-theme' : 'light-theme'}>
      <h1>Hello, {user?.first_name || 'Guest'}!</h1>
      <p>Welcome to the Next.js Telegram Mini App</p>
    </main>
  );
}
```

#### API Route Handler (Bot Webhook)

```typescript
// app/api/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BotClient } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: process.env.TELEGRAM_BOT_TOKEN! });

// Set up handlers
bot.on('message', async (message) => {
  if (message.text === '/start') {
    await bot.sendMessage(message.chat.id, 'Hello from Next.js! 🚀');
  }
});

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();

    // Process update
    if (update.message) {
      bot.emit('message', update.message);
    } else if (update.callback_query) {
      bot.emit('callback_query', update.callback_query);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing update:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Bot webhook endpoint is running',
    timestamp: new Date().toISOString(),
  });
}
```

---

## 🎯 Core Concepts

### BotClient

The `BotClient` is the main class for interacting with the Telegram Bot API.

```typescript
import { BotClient } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({
  token: 'YOUR_BOT_TOKEN',
  baseUrl: 'https://api.telegram.org',     // Optional - custom API URL
  timeout: 30000,                           // Optional - request timeout (ms)
  retry: {
    maxRetries: 3,                          // Maximum retry attempts
    retryDelay: 1000,                       // Delay between retries (ms)
    retryOn: [429, 500, 502, 503, 504]     // HTTP status codes to retry
  }
});
```

### Router & Middleware

The Router provides a clean way to organize bot handlers:

```typescript
import { BotClient, Router, Context } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: 'TOKEN' });
const router = new Router();

// Command handler
router.command('start', async (ctx) => {
  const context = ctx as Context;
  await context.reply(
    'Welcome! Use /help to see available commands.'
  );
});

// Text patterns
router.hears('hello', async (ctx) => {
  const context = ctx as Context;
  await context.reply('Hello there! 👋');
});

// Regex patterns
router.hears(/age (\d+)/i, async (ctx) => {
  const context = ctx as Context;
  const age = context.match?.[1];
  await context.reply(`You are ${age} years old!`);
});

// Callback queries
router.action('delete_post', async (ctx) => {
  const context = ctx as Context;
  await context.delete();
  await context.answer('Post deleted!');
});

// Events
router.event('chat_member', async (ctx) => {
  const context = ctx as Context;
  const update = context.update;
  
  if (update.my_chat_member?.new_chat_member.status === 'kicked') {
    console.log('Bot was removed from a chat');
  }
});

// Connect router to bot
bot.on('message', async (update) => {
  const ctx = new Context(
    { update_id: Date.now(), message: update } as any,
    bot
  );
  
  await router.middleware()(ctx, async () => {
    // Default handler if no routes match
    await bot.sendMessage(
      ctx.chatId!,
      'Command not recognized. Type /help for available commands.'
    );
  });
});

bot.startPolling();
```

### Keyboard Builders

#### Inline Keyboard

```typescript
import { inlineKeyboard } from '@abdosaiko20/tg-sdk';

const keyboard = inlineKeyboard()
  // Row 1
  .text('Option 1', 'option_1')
  .text('Option 2', 'option_2')
  .text('Option 3', 'option_3')
  .row()
  // Row 2
  .url('Visit Website', 'https://example.com')
  .webApp('Open App', 'https://app.example.com')
  .row()
  // Row 3
  .login('Login', 'https://login.example.com')
  .switchInline('Share', 'Check this out!')
  .row()
  // Row 4
  .pay('⭐ 100 Stars')
  .build();

await bot.sendMessage(chatId, 'Choose an option:', {
  reply_markup: keyboard
});
```

#### Reply Keyboard

```typescript
import { replyKeyboard } from '@abdosaiko20/tg-sdk';

const keyboard = replyKeyboard()
  .text('📊 Statistics')
  .text('📅 Schedule')
  .row()
  .text('⚙️ Settings')
  .text('❓ Help')
  .row()
  .requestContact('📞 Share Contact')
  .requestLocation('📍 Share Location')
  .resize()
  .oneTime()
  .placeholder('Choose an option from the menu...')
  .build();

await bot.sendMessage(chatId, 'Main Menu:', {
  reply_markup: keyboard
});
```

### Markdown & HTML Builders

#### MarkdownV2

```typescript
import { markdown, ParseMode } from '@abdosaiko20/tg-sdk';

const message = markdown()
  .bold('Welcome to our Bot!')
  .newLine()
  .newLine()
  .italic('Here are your options:')
  .newLine()
  .text('• ')
  .code('/start')
  .text(' - Begin interaction')
  .newLine()
  .text('• ')
  .code('/help')
  .text(' - Get help')
  .newLine()
  .newLine()
  .quote('Tip: You can also use inline buttons below!')
  .newLine()
  .spoiler('Spoiler: There is a hidden feature!')
  .toString();

await bot.sendMessage(chatId, message, {
  parse_mode: ParseMode.MarkdownV2
});
```

#### HTML

```typescript
import { html } from '@abdosaiko20/tg-sdk';

const message = html()
  .bold('Important Announcement')
  .newLine()
  .newLine()
  .text('We are excited to announce our ')
  .link('new feature', 'https://example.com')
  .text('!')
  .newLine()
  .newLine()
  .pre('const greeting = "Hello World!";', 'javascript')
  .newLine()
  .italic('Stay tuned for more updates!')
  .toString();

await bot.sendMessage(chatId, message, {
  parse_mode: 'HTML'
});
```

### Session Management

```typescript
import { BotClient, SessionManager } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: 'TOKEN' });

// In-memory session (default)
const session = new SessionManager();

// Custom storage adapter (e.g., Redis)
const redisSession = new SessionManager({
  get: async (key) => {
    const data = await redis.get(`session:${key}`);
    return data ? JSON.parse(data) : null;
  },
  set: async (key, data) => {
    await redis.set(
      `session:${key}`,
      JSON.stringify(data),
      'EX',
      3600 // 1 hour expiry
    );
  },
  delete: async (key) => {
    await redis.del(`session:${key}`);
  }
});

// MongoDB storage adapter
const mongoSession = new SessionManager({
  get: async (key) => {
    return await SessionModel.findOne({ userId: key }).lean();
  },
  set: async (key, data) => {
    await SessionModel.updateOne(
      { userId: key },
      { $set: { ...data, updatedAt: new Date() } },
      { upsert: true }
    );
  },
  delete: async (key) => {
    await SessionModel.deleteOne({ userId: key });
  }
});

// Use session middleware
bot.on('message', session.middleware());
bot.on('message', async (msg) => {
  // Session is available in middleware context
  // Use with Router for best results
});
```

### Plugin System

```typescript
import { BotClient, PluginSystem } from '@abdosaiko20/tg-sdk';

const bot = new BotClient({ token: 'TOKEN' });
const plugins = new PluginSystem();

// Logger plugin
const loggerPlugin = async (ctx, next) => {
  const start = Date.now();
  console.log(`📥 Update from ${ctx.user?.id}`);
  
  await next();
  
  const duration = Date.now() - start;
  console.log(`✅ Processed in ${duration}ms`);
};

// Rate limiter plugin
const rateLimiterPlugin = async (ctx, next) => {
  const userId = ctx.user?.id;
  if (!userId) return next();
  
  const requests = await redis.incr(`rate:${userId}`);
  await redis.expire(`rate:${userId}`, 60);
  
  if (requests > 30) {
    throw new Error('Rate limit exceeded');
  }
  
  await next();
};

// Error handler plugin
const errorHandlerPlugin = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Plugin error:', error);
    await bot.sendMessage(
      ctx.chatId!,
      'An error occurred. Please try again later.'
    );
  }
};

// Register plugins
plugins.use(loggerPlugin);
plugins.use(rateLimiterPlugin);
plugins.use(errorHandlerPlugin);

// Apply to bot
bot.use(plugins.middleware());
```

---

## 🔥 Advanced Usage

### Broadcast System

```typescript
const broadcastResult = await bot.broadcast(
  'sendMessage',
  {
    text: '🔥 Important Announcement!\n\nWe have launched new features!',
    parse_mode: 'HTML',
    disable_notification: false,
  },
  {
    chatIds: [123456789, 987654321, 555555555],
    concurrency: 10,        // Send to 10 users simultaneously
    delay: 500,             // 500ms delay between batches
    stopOnError: false,     // Continue even if some fail
    
    onStart: (total) => {
      console.log(`📡 Starting broadcast to ${total} users`);
    },
    
    onProgress: (current, total) => {
      const percentage = Math.round((current / total) * 100);
      console.log(`📊 Progress: ${current}/${total} (${percentage}%)`);
    },
    
    onSuccess: (chatId, result) => {
      console.log(`✅ Successfully sent to ${chatId}`);
    },
    
    onError: (chatId, error) => {
      console.error(`❌ Failed to send to ${chatId}:`, error.message);
    },
    
    onFinish: (results) => {
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      console.log('📋 Broadcast Summary:');
      console.log(`   ✅ Successful: ${successful}`);
      console.log(`   ❌ Failed: ${failed}`);
      console.log(`   📊 Success Rate: ${((successful / results.length) * 100).toFixed(2)}%`);
    }
  }
);
```

### Telegram Stars (Payments)

```typescript
// Create a Stars invoice link
const invoiceLink = await bot.createStarsInvoice({
  title: 'Premium Subscription',
  description: 'Get access to premium features for 1 month',
  payload: 'premium_monthly_subscription',
  currency: 'XTR',
  prices: [
    { label: 'Premium Features', amount: 100 },
    { label: 'Priority Support', amount: 50 }
  ],
  max_tip_amount: 200,
  suggested_tip_amounts: [100, 150, 200],
  photo_url: 'https://example.com/premium-banner.jpg',
  need_name: true,
  need_email: true,
  need_phone_number: true,
  is_flexible: false,
});

// Send Stars invoice directly to a user
const invoiceMessage = await bot.sendStarsInvoice(chatId, {
  title: 'Premium Access',
  description: 'Unlock all premium features',
  payload: 'premium_access',
  prices: [{ label: 'Premium', amount: 150 }],
  photo_url: 'https://example.com/premium.jpg',
});

// Handle pre-checkout queries
bot.on('pre_checkout_query', async (query) => {
  // Validate the order
  const isValid = await validateOrder(query.invoice_payload);
  
  await bot.answerPreCheckoutQuery(query.id, isValid, {
    error_message: isValid ? undefined : 'Order validation failed'
  });
});

// Handle successful payments
bot.on('message', async (message) => {
  if (message.successful_payment) {
    const payment = message.successful_payment;
    
    // Grant access to premium features
    await grantPremiumAccess(
      message.from.id,
      payment.invoice_payload
    );
    
    await bot.sendMessage(
      message.chat.id,
      '✅ Thank you for your purchase! You now have premium access.'
    );
  }
});

// Refund a payment
const refundResult = await bot.refundStarPayment(
  userId,
  'telegram_payment_charge_id'
);

if (refundResult) {
  console.log('Payment refunded successfully');
}
```

### File Handling

```typescript
// Send a photo from URL
await bot.sendPhoto(chatId, 'https://example.com/photo.jpg', {
  caption: 'Check out this photo!',
  has_spoiler: false
});

// Send a local file
import { readFileSync } from 'fs';

const photoBuffer = readFileSync('./photo.jpg');
const blob = new Blob([photoBuffer], { type: 'image/jpeg' });

await bot.sendPhoto(chatId, blob, {
  caption: 'Local photo upload'
});

// Download a file
const fileId = 'AgACAgIAAxkBAA...';
const fileData = await bot.downloadFile(fileId);

// Save to disk
import { writeFileSync } from 'fs';
writeFileSync('./downloaded_file.jpg', Buffer.from(fileData));

// Get file info
const fileInfo = await bot.getFile(fileId);
console.log('File path:', fileInfo.file_path);
console.log('File size:', fileInfo.file_size);

// Get direct download URL
const downloadUrl = bot.getFileUrl(fileInfo.file_path);
console.log('Download URL:', downloadUrl);
```

---

## 📚 API Reference

### BotClient Methods

#### 📨 Message Methods
| Method | Description |
|--------|-------------|
| `sendMessage(chatId, text, options?)` | Send text message |
| `sendPhoto(chatId, photo, options?)` | Send photo |
| `sendVideo(chatId, video, options?)` | Send video |
| `sendAudio(chatId, audio, options?)` | Send audio |
| `sendDocument(chatId, doc, options?)` | Send document |
| `sendAnimation(chatId, animation, options?)` | Send animation (GIF) |
| `sendVoice(chatId, voice, options?)` | Send voice message |
| `sendVideoNote(chatId, note, options?)` | Send video note |
| `sendMediaGroup(chatId, media, options?)` | Send media group |
| `sendLocation(chatId, lat, lon, options?)` | Send location |
| `sendVenue(chatId, lat, lon, title, address, options?)` | Send venue |
| `sendContact(chatId, phone, name, options?)` | Send contact |
| `sendPoll(chatId, question, options, config?)` | Send poll |
| `sendDice(chatId, options?)` | Send dice |
| `sendSticker(chatId, sticker, options?)` | Send sticker |
| `sendGame(chatId, gameName, options?)` | Send game |
| `sendInvoice(chatId, ...invoiceParams)` | Send invoice |
| `sendChatAction(chatId, action)` | Send chat action |

#### ✏️ Edit Methods
| Method | Description |
|--------|-------------|
| `editMessageText(chatId, msgId, text, options?)` | Edit message text |
| `editMessageCaption(chatId, msgId, options?)` | Edit caption |
| `editMessageMedia(chatId, msgId, media, options?)` | Edit media |
| `editMessageReplyMarkup(chatId, msgId, options?)` | Edit reply markup |

#### 🗑️ Delete Methods
| Method | Description |
|--------|-------------|
| `deleteMessage(chatId, msgId)` | Delete single message |
| `deleteMessages(chatId, msgIds)` | Delete multiple messages |

#### 📋 Chat Methods
| Method | Description |
|--------|-------------|
| `getChat(chatId)` | Get chat information |
| `getChatAdministrators(chatId)` | Get chat admins |
| `getChatMemberCount(chatId)` | Get member count |
| `getChatMember(chatId, userId)` | Get member info |
| `leaveChat(chatId)` | Leave chat |
| `banChatMember(chatId, userId)` | Ban member |
| `unbanChatMember(chatId, userId)` | Unban member |
| `restrictChatMember(chatId, userId, perms)` | Restrict member |
| `promoteChatMember(chatId, userId, rights)` | Promote member |
| `setChatPermissions(chatId, perms)` | Set permissions |
| `setChatPhoto(chatId, photo)` | Set chat photo |
| `deleteChatPhoto(chatId)` | Delete chat photo |
| `setChatTitle(chatId, title)` | Set chat title |
| `setChatDescription(chatId, desc)` | Set description |
| `pinChatMessage(chatId, msgId)` | Pin message |
| `unpinChatMessage(chatId, msgId?)` | Unpin message |

#### 🔗 Invite Methods
| Method | Description |
|--------|-------------|
| `exportChatInviteLink(chatId)` | Export invite link |
| `createChatInviteLink(chatId, options)` | Create invite link |
| `editChatInviteLink(chatId, link, options)` | Edit invite link |
| `revokeChatInviteLink(chatId, link)` | Revoke invite link |

#### 👤 User Methods
| Method | Description |
|--------|-------------|
| `getMe()` | Get bot info |
| `getUserProfilePhotos(userId, options?)` | Get profile photos |

#### 📁 File Methods
| Method | Description |
|--------|-------------|
| `getFile(fileId)` | Get file info |
| `downloadFile(fileIdOrPath)` | Download file |
| `getFileUrl(filePath)` | Get file URL |

#### 💳 Payment Methods
| Method | Description |
|--------|-------------|
| `sendInvoice(...)` | Send invoice |
| `createInvoiceLink(...)` | Create invoice link |
| `answerShippingQuery(id, ok, options?)` | Answer shipping query |
| `answerPreCheckoutQuery(id, ok, options?)` | Answer pre-checkout |
| `createStarsInvoice(params)` | Create Stars invoice |
| `sendStarsInvoice(chatId, params)` | Send Stars invoice |
| `refundStarPayment(userId, chargeId)` | Refund Stars payment |

#### 🎮 Game Methods
| Method | Description |
|--------|-------------|
| `sendGame(chatId, gameName, options?)` | Send game |
| `setGameScore(userId, score, options?)` | Set game score |
| `getGameHighScores(userId, options?)` | Get high scores |

#### 🏷️ Sticker Methods
| Method | Description |
|--------|-------------|
| `getStickerSet(name)` | Get sticker set |
| `uploadStickerFile(userId, sticker, format)` | Upload sticker |
| `createNewStickerSet(userId, name, title, stickers)` | Create sticker set |
| `addStickerToSet(userId, name, sticker)` | Add sticker |
| `deleteStickerFromSet(sticker)` | Delete sticker |
| `setStickerSetThumbnail(name, userId, thumb?)` | Set thumbnail |

#### 📢 Forum Methods
| Method | Description |
|--------|-------------|
| `createForumTopic(chatId, name, options?)` | Create topic |
| `editForumTopic(chatId, threadId, options?)` | Edit topic |
| `closeForumTopic(chatId, threadId)` | Close topic |
| `reopenForumTopic(chatId, threadId)` | Reopen topic |
| `deleteForumTopic(chatId, threadId)` | Delete topic |

#### 🌐 Webhook Methods
| Method | Description |
|--------|-------------|
| `setWebhook(url, options?)` | Set webhook |
| `deleteWebhook(options?)` | Delete webhook |
| `getWebhookInfo()` | Get webhook info |
| `startWebhook(options?)` | Start webhook server |
| `stopWebhook()` | Stop webhook server |

#### 📡 Polling Methods
| Method | Description |
|--------|-------------|
| `startPolling(options?)` | Start long polling |
| `stopPolling()` | Stop polling |

---

## 🔷 TypeScript Support

The SDK is written in TypeScript and provides complete type definitions out of the box.

```typescript
import type {
  TelegramMessage,
  TelegramUser,
  TelegramChat,
  CallbackQuery,
  InlineQuery,
  ChatMember,
  WebAppInitData,
  ThemeParams,
  BotConfig,
  BroadcastConfig,
  // ... and many more
} from '@abdosaiko20/tg-sdk';

// Full type safety
const handleMessage = (message: TelegramMessage) => {
  const chat: TelegramChat = message.chat;
  const user: TelegramUser | undefined = message.from;
  
  if (user?.is_premium) {
    // Premium user logic
  }
};
```

---

## 🌍 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| **Node.js 18+** | ✅ Full Support | Native fetch API |
| **Node.js 20+** | ✅ Full Support | Recommended |
| **Node.js 22+** | ✅ Full Support | Latest features |
| **Deno** | ✅ Full Support | Native TypeScript |
| **Bun** | ✅ Full Support | Fast runtime |
| **Cloudflare Workers** | ✅ Full Support | Edge computing |
| **Vercel Edge** | ✅ Full Support | Edge runtime |
| **React 16.8+** | ✅ Full Support | Hooks API |
| **React 18+** | ✅ Full Support | Concurrent features |
| **Next.js 13+** | ✅ Full Support | App & Pages Router |
| **Next.js 14+** | ✅ Full Support | Latest features |
| **Vue 3** | ✅ Full Support | Composition API |
| **Svelte 4+** | ✅ Full Support | Runes support |
| **Angular 12+** | ✅ Full Support | Ivy engine |
| **Nuxt 3** | ✅ Full Support | SSR/SSG |
| **Browser** | ✅ Full Support | Mini Apps |

---

## 📝 Examples

Check out our [examples directory](https://github.com/yourusername/tg-sdk/tree/main/examples) for more:

- [Simple Echo Bot](https://github.com/yourusername/tg-sdk/tree/main/examples/echo-bot)
- [Full-Featured Bot with Router](https://github.com/yourusername/tg-sdk/tree/main/examples/router-bot)
- [Payment Bot with Stars](https://github.com/yourusername/tg-sdk/tree/main/examples/payment-bot)
- [Mini App with React](https://github.com/yourusername/tg-sdk/tree/main/examples/react-mini-app)
- [Next.js Mini App](https://github.com/yourusername/tg-sdk/tree/main/examples/nextjs-mini-app)
- [Webhook Bot with Express](https://github.com/yourusername/tg-sdk/tree/main/examples/webhook-express)
- [Serverless Bot (Vercel)](https://github.com/yourusername/tg-sdk/tree/main/examples/vercel-serverless)
- [Broadcast System](https://github.com/yourusername/tg-sdk/tree/main/examples/broadcast)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/yourusername/tg-sdk/blob/main/CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/tg-sdk.git
cd tg-sdk

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### Project Structure

```
tg-sdk/
├── src/
│   ├── types.ts          # TypeScript type definitions
│   ├── core.ts           # Core Telegram detection & utilities
│   ├── bot.ts            # Bot API client
│   ├── mini-app.ts       # Mini Apps API
│   ├── keyboard.ts       # Keyboard builders
│   ├── markdown.ts       # Markdown & HTML builders
│   ├── middleware.ts     # Middleware, Router, Session, Plugins
│   ├── utils.ts          # Utility functions
│   ├── react.ts          # React hooks
│   └── index.ts          # Main entry point
├── examples/             # Example projects
├── tests/                # Test files
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔒 Security

### Best Practices

1. **Never expose your bot token**: Use environment variables
2. **Validate webhook requests**: Use `secret_token` for webhook security
3. **Rate limit users**: Use the plugin system for rate limiting
4. **Sanitize user input**: Escape markdown/HTML in user-generated content
5. **Use HTTPS for webhooks**: Always use HTTPS in production

### Reporting Vulnerabilities

If you discover a security vulnerability, please email us at [security@example.com](mailto:security@example.com). Do not open a public issue.

---

## ❓ FAQ

<details>
<summary><strong>What's the difference between Polling and Webhook?</strong></summary>

- **Polling**: The bot continuously asks Telegram for new updates. Simpler to set up, but less efficient.
- **Webhook**: Telegram sends updates to your server. More efficient, but requires a public HTTPS URL.
</details>

<details>
<summary><strong>Can I use this SDK in the browser?</strong></summary>

Yes! The Mini Apps part of the SDK is designed to run in Telegram's WebView browser. The Bot API part requires Node.js or a server environment.
</details>

<details>
<summary><strong>How do I handle millions of users?</strong></summary>

Use the broadcast system with proper concurrency settings, implement caching, use a database for sessions, and consider horizontal scaling with webhooks.
</details>

<details>
<summary><strong>Does this support Telegram Stars?</strong></summary>

Yes! Full support for creating and sending Stars invoices, handling pre-checkout queries, and refunding payments.
</details>

<details>
<summary><strong>Can I use custom storage for sessions?</strong></summary>

Yes! The SessionManager supports custom storage adapters. You can use Redis, MongoDB, PostgreSQL, or any other storage solution.
</details>

---

## 📊 Changelog

See [CHANGELOG.md](https://github.com/yourusername/tg-sdk/blob/main/CHANGELOG.md) for a detailed history of changes.

---

## 📄 License

MIT License - see the [LICENSE](https://github.com/yourusername/tg-sdk/blob/main/LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Telegram Bot API](https://core.telegram.org/bots/api) - Official documentation
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps) - WebApp documentation
- All our [contributors](https://github.com/yourusername/tg-sdk/graphs/contributors)

---

## 📞 Support

- 📚 [Documentation](https://github.com/yourusername/tg-sdk/wiki)
- 🐛 [Issue Tracker](https://github.com/yourusername/tg-sdk/issues)
- 💬 [Telegram Community](https://t.me/tg_sdk_community)
- 📧 [Email Support](mailto:support@example.com)

---

<p align="center">
  <strong>⭐ If you find this project useful, please give it a star on GitHub!</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@abdosaiko20/tg-sdk">
    <img src="https://nodei.co/npm/@abdosaiko20/tg-sdk.png?downloads=true&downloadRank=true&stars=true" alt="npm stats">
  </a>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/abdosaiko20">@abdosaiko20</a>
</p>
```
