// ==================== Markdown Builder ====================
export class MarkdownBuilder {
  private parts: string[] = [];

  /**
   * Add bold text (MarkdownV2)
   */
  bold(text: string): this {
    this.parts.push(`*${this.escape(text)}*`);
    return this;
  }

  /**
   * Add italic text
   */
  italic(text: string): this {
    this.parts.push(`_${this.escape(text)}_`);
    return this;
  }

  /**
   * Add underlined text
   */
  underline(text: string): this {
    this.parts.push(`__${this.escape(text)}__`);
    return this;
  }

  /**
   * Add strikethrough text
   */
  strikethrough(text: string): this {
    this.parts.push(`~${this.escape(text)}~`);
    return this;
  }

  /**
   * Add spoiler text
   */
  spoiler(text: string): this {
    this.parts.push(`||${this.escape(text)}||`);
    return this;
  }

  /**
   * Add inline code
   */
  code(text: string): this {
    this.parts.push(`\`${this.escapeCode(text)}\``);
    return this;
  }

  /**
   * Add code block
   */
  pre(text: string, language?: string): this {
    const lang = language ? `${language}\n` : '';
    this.parts.push(`\`\`\`${lang}${this.escapeCode(text)}\`\`\``);
    return this;
  }

  /**
   * Add blockquote
   */
  quote(text: string): this {
    this.parts.push(`>${this.escape(text)}`);
    return this;
  }

  /**
   * Add a user mention
   */
  mention(text: string, userId: number): this {
    this.parts.push(`[${this.escape(text)}](tg://user?id=${userId})`);
    return this;
  }

  /**
   * Add a link
   */
  link(text: string, url: string): this {
    this.parts.push(`[${this.escape(text)}](${url})`);
    return this;
  }

  /**
   * Add custom emoji
   */
  emoji(emojiId: string): this {
    this.parts.push(`![](${emojiId})`);
    return this;
  }

  /**
   * Add plain text
   */
  text(text: string): this {
    this.parts.push(this.escape(text));
    return this;
  }

  /**
   * Add raw text without escaping
   */
  raw(text: string): this {
    this.parts.push(text);
    return this;
  }

  /**
   * Add a new line
   */
  newLine(): this {
    this.parts.push('\n');
    return this;
  }

  /**
   * Add a horizontal rule
   */
  hr(): this {
    this.parts.push('\n---\n');
    return this;
  }

  /**
   * Escape special MarkdownV2 characters
   */
  private escape(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  }

  /**
   * Escape code-specific characters
   */
  private escapeCode(text: string): string {
    return text.replace(/[`\\]/g, '\\$&');
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.parts.join('');
  }

  // Static helpers
  static bold(text: string): string {
    return `*${text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}*`;
  }

  static italic(text: string): string {
    return `_${text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}_`;
  }

  static code(text: string): string {
    return `\`${text.replace(/[`\\]/g, '\\$&')}\``;
  }

  static pre(text: string, language?: string): string {
    const lang = language ? `${language}\n` : '';
    return `\`\`\`${lang}${text.replace(/[`\\]/g, '\\$&')}\`\`\``;
  }

  static link(text: string, url: string): string {
    return `[${text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}](${url})`;
  }
}

// ==================== HTML Builder ====================
export class HTMLBuilder {
  private parts: string[] = [];

  /**
   * Add bold text
   */
  bold(text: string): this {
    this.parts.push(`<b>${this.escape(text)}</b>`);
    return this;
  }

  /**
   * Add italic text
   */
  italic(text: string): this {
    this.parts.push(`<i>${this.escape(text)}</i>`);
    return this;
  }

  /**
   * Add underlined text
   */
  underline(text: string): this {
    this.parts.push(`<u>${this.escape(text)}</u>`);
    return this;
  }

  /**
   * Add strikethrough text
   */
  strikethrough(text: string): this {
    this.parts.push(`<s>${this.escape(text)}</s>`);
    return this;
  }

  /**
   * Add spoiler text
   */
  spoiler(text: string): this {
    this.parts.push(`<tg-spoiler>${this.escape(text)}</tg-spoiler>`);
    return this;
  }

  /**
   * Add inline code
   */
  code(text: string): this {
    this.parts.push(`<code>${this.escape(text)}</code>`);
    return this;
  }

  /**
   * Add code block
   */
  pre(text: string, language?: string): this {
    const langAttr = language ? ` class="language-${language}"` : '';
    this.parts.push(`<pre><code${langAttr}>${this.escape(text)}</code></pre>`);
    return this;
  }

  /**
   * Add a link
   */
  link(text: string, url: string): this {
    this.parts.push(`<a href="${url}">${this.escape(text)}</a>`);
    return this;
  }

  /**
   * Add blockquote
   */
  quote(text: string): this {
    this.parts.push(`<blockquote>${this.escape(text)}</blockquote>`);
    return this;
  }

  /**
   * Add a user mention
   */
  mention(text: string, userId: number): this {
    this.parts.push(`<a href="tg://user?id=${userId}">${this.escape(text)}</a>`);
    return this;
  }

  /**
   * Add custom emoji
   */
  emoji(emojiId: string): this {
    this.parts.push(`<tg-emoji emoji-id="${emojiId}"></tg-emoji>`);
    return this;
  }

  /**
   * Add plain text
   */
  text(text: string): this {
    this.parts.push(this.escape(text));
    return this;
  }

  /**
   * Add raw text without escaping
   */
  raw(text: string): this {
    this.parts.push(text);
    return this;
  }

  /**
   * Add a new line
   */
  newLine(): this {
    this.parts.push('\n');
    return this;
  }

  /**
   * Escape HTML special characters
   */
  private escape(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.parts.join('');
  }

  // Static helpers
  static bold(text: string): string {
    return `<b>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</b>`;
  }

  static italic(text: string): string {
    return `<i>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</i>`;
  }

  static code(text: string): string {
    return `<code>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
  }

  static link(text: string, url: string): string {
    return `<a href="${url}">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>`;
  }
}

// ==================== Factory Functions ====================
export function markdown(): MarkdownBuilder {
  return new MarkdownBuilder();
}

export function html(): HTMLBuilder {
  return new HTMLBuilder();
}

// Export parse mode constants
export const ParseMode = {
  HTML: 'HTML' as const,
  Markdown: 'Markdown' as const,
  MarkdownV2: 'MarkdownV2' as const,
};