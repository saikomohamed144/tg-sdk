// Utility functions used across the SDK
import type { RetryConfig, QueueItem, CacheItem } from './types';

// ==================== Crypto Helpers ====================
export async function createHash(data: string, algorithm = 'SHA-256'): Promise<string> {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    const encoder = new TextEncoder();
    const hashBuffer = await globalThis.crypto.subtle.digest(algorithm, encoder.encode(data));
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  try {
    const crypto = await import('node:crypto');
    const hash = crypto.createHash(algorithm.replace('SHA-', 'sha'));
    hash.update(data);
    return hash.digest('hex');
  } catch {
    return simpleHash(data);
  }
}

export function createHmac(key: string, data: string): string {
  return simpleHmac(key, data);
}

export async function createHmacAsync(key: string, data: string, algorithm = 'SHA-256'): Promise<string> {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);
      const cryptoKey = await globalThis.crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: algorithm }, false, ['sign']
      );
      const signature = await globalThis.crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch {
      return simpleHmac(key, data);
    }
  }
  
  try {
    const crypto = await import('node:crypto');
    const hmac = crypto.createHmac(algorithm.replace('SHA-', 'sha'), key);
    hmac.update(data);
    return hmac.digest('hex');
  } catch {
    return simpleHmac(key, data);
  }
}

function simpleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

function simpleHmac(key: string, data: string): string {
  const blockSize = 64;
  let processedKey = key;
  if (processedKey.length > blockSize) processedKey = simpleHash(processedKey);
  while (processedKey.length < blockSize) processedKey += '\0';
  
  let innerPad = '', outerPad = '';
  for (let i = 0; i < blockSize; i++) {
    innerPad += String.fromCharCode(0x36 ^ processedKey.charCodeAt(i));
    outerPad += String.fromCharCode(0x5c ^ processedKey.charCodeAt(i));
  }
  
  return simpleHash(outerPad + simpleHash(innerPad + data));
}

// ==================== Async Helpers ====================
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ==================== ID Generation ====================
export function randomId(length = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ==================== Deep Merge ====================
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();
  if (!source) return target;

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as Record<string, any>, source[key] as Record<string, any>);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item: unknown): item is Record<string, unknown> {
  return !!item && typeof item === 'object' && !Array.isArray(item) && item !== null;
}

// ==================== Retry Logic ====================
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000, retryOn = [429, 500, 502, 503, 504] } = config;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) break;
      
      const status = (error as any)?.status;
      if (status && !retryOn.includes(status)) throw error;
      
      await sleep(retryDelay * (attempt + 1));
    }
  }
  
  throw lastError || new Error('Retry failed');
}

// ==================== HTTP Helpers ====================
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...fetchOptions, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchJSON<T = any>(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const response = await fetchWithTimeout(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw Object.assign(new Error(`HTTP ${response.status}: ${response.statusText}`), {
      status: response.status,
      body: error
    });
  }
  return response.json();
}

// ==================== Validation Helpers ====================
export function validateRequired<T>(value: T | null | undefined, name: string): T {
  if (value == null) throw new Error(`${name} is required`);
  return value;
}

export function validateType<T>(value: unknown, expectedType: string, name: string): T {
  if (typeof value !== expectedType) {
    throw new Error(`${name} must be of type ${expectedType}, got ${typeof value}`);
  }
  return value as T;
}

// ==================== Queue System ====================
export class AsyncQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private concurrency: number;

  constructor(concurrency = 5) {
    this.concurrency = concurrency;
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        id: randomId(),
        task,
        resolve: resolve as any,
        reject
      });
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    try {
      while (this.queue.length > 0) {
        const batch = this.queue.splice(0, this.concurrency);
        await Promise.allSettled(
          batch.map(async (item) => {
            try {
              const result = await item.task();
              item.resolve(result);
            } catch (error) {
              item.reject(error as Error);
            }
          })
        );
      }
    } finally {
      this.processing = false;
    }
  }
}

// ==================== Rate Limiter ====================
export class RateLimiter {
  private timestamps: number[] = [];
  
  constructor(private maxRequests: number, private windowMs: number) {}

  async acquire(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);
    
    if (this.timestamps.length >= this.maxRequests) {
      const oldestTimestamp = this.timestamps[0];
      const waitTime = this.windowMs - (now - oldestTimestamp);
      if (waitTime > 0) await sleep(waitTime);
    }
    
    this.timestamps.push(Date.now());
  }
}

// ==================== Cache System ====================
export class MemoryCache {
  private store = new Map<string, CacheItem>();
  
  set<T>(key: string, value: T, ttlMs = 5 * 60 * 1000): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  has(key: string): boolean {
    const item = this.store.get(key);
    if (!item) return false;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }
}

// ==================== Logger ====================
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  private levels: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
  private config: { level?: LogLevel };

  constructor(config: { level?: LogLevel } = {}) {
    this.config = config;
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) console.debug('[tg-lite:debug]', ...args);
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) console.info('[tg-lite:info]', ...args);
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) console.warn('[tg-lite:warn]', ...args);
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) console.error('[tg-lite:error]', ...args);
  }

  private shouldLog(level: LogLevel): boolean {
    const configLevel = this.config.level || 'info';
    return this.levels[level] >= this.levels[configLevel];
  }
}

// ==================== Scheduler ====================
export class Scheduler {
  private jobs = new Map<string, ReturnType<typeof setInterval>>();

  schedule(id: string, task: () => void | Promise<void>, intervalMs: number): void {
    this.cancel(id);
    const timer = setInterval(async () => {
      try {
        await task();
      } catch (error) {
        console.error(`Scheduler job ${id} error:`, error);
      }
    }, intervalMs);
    this.jobs.set(id, timer);
  }

  cancel(id: string): void {
    const timer = this.jobs.get(id);
    if (timer) {
      clearInterval(timer);
      this.jobs.delete(id);
    }
  }

  cancelAll(): void {
    for (const [id, timer] of this.jobs.entries()) {
      clearInterval(timer);
      this.jobs.delete(id);
    }
  }
}

// ==================== Event Emitter ====================
export class EventEmitter {
  private handlers = new Map<string, Set<(...args: any[]) => void>>();

  on(event: string, handler: (...args: any[]) => void): this {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return this;
  }

  once(event: string, handler: (...args: any[]) => void): this {
    const onceHandler = (...args: any[]) => {
      handler(...args);
      this.off(event, onceHandler);
    };
    return this.on(event, onceHandler);
  }

  off(event: string, handler: (...args: any[]) => void): this {
    const handlers = this.handlers.get(event);
    if (handlers) handlers.delete(handler);
    return this;
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
    return this;
  }
}

// ==================== Form Data Builder ====================
export function buildFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    
    if (value instanceof Blob || value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }
  
  return formData;
}