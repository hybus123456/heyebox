"use client";

import { useState } from "react";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(`# 标题

## 二级标题

这是一段 **粗体** 和 *斜体* 文本。

- 列表项 1
- 列表项 2
- 列表项 3

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

> 这是一段引用

[链接文字](https://example.com)
`);

  const renderMarkdown = (text: string) => {
    const codeBlocks: string[] = [];
    let processed = text.replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```\w*\n?/g, '').replace(/```$/g, '');
      codeBlocks.push(escapeHtml(code));
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });

    processed = escapeHtml(processed);

    processed = processed
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/^\&gt; (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br />');

    processed = processed.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
      return `<pre><code>${codeBlocks[parseInt(index)]}</code></pre>`;
    });

    return processed;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Markdown 输入
        </label>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-[500px] px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 resize-none"
          placeholder="输入 Markdown 文本"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          预览效果
        </label>
        <div
          className="w-full h-[500px] px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-auto prose prose-zinc dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
        />
      </div>
    </div>
  );
}
