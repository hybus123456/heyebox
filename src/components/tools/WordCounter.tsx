"use client";

import { useState } from "react";

interface WordCount {
  word: string;
  count: number;
  percentage: number;
}

export function WordCounter() {
  const [text, setText] = useState("");

  const getStats = () => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter(Boolean).length : 0;

    return { chars, charsNoSpaces, words, lines, paragraphs, sentences };
  };

  const getWordFrequency = (): WordCount[] => {
    if (!text.trim()) return [];
    
    const stopWords = new Set(["的", "了", "是", "在", "我", "有", "和", "就", "不", "人", "都", "一", "一个", "上", "也", "很", "到", "说", "要", "去", "你", "会", "着", "没有", "看", "好", "自己", "这", "the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "shall", "can", "it", "its", "he", "she", "they", "we", "you", "i", "me", "him", "her", "them", "us", "my", "your", "his", "their", "our", "this", "that", "these", "those", "and", "or", "but", "if", "then", "so", "for", "of", "to", "in", "on", "at", "by", "with", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "out", "off", "over", "under", "again", "further", "then", "once"]);
    
    const wordMap = new Map<string, number>();
    const cleaned = text.toLowerCase().replace(/[^\w\u4e00-\u9fff\s]/g, "");
    const wordList = cleaned.split(/\s+/).filter(w => w.length > 1 && !stopWords.has(w));
    
    wordList.forEach(word => {
      wordMap.set(word, (wordMap.get(word) || 0) + 1);
    });

    const total = wordList.length;
    return Array.from(wordMap.entries())
      .map(([word, count]) => ({ word, count, percentage: (count / total) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  };

  const stats = getStats();
  const wordFreq = getWordFrequency();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">输入文本</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          placeholder="粘贴或输入文本..."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: "字符", value: stats.chars },
          { label: "无空格", value: stats.charsNoSpaces },
          { label: "单词", value: stats.words },
          { label: "行数", value: stats.lines },
          { label: "段落", value: stats.paragraphs },
          { label: "句子", value: stats.sentences },
        ].map((stat) => (
          <div key={stat.label} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-center">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {wordFreq.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">词频统计 Top 20</h3>
          <div className="space-y-2">
            {wordFreq.map((item, index) => (
              <div key={item.word} className="flex items-center gap-3">
                <span className="w-6 text-xs text-zinc-400">{index + 1}</span>
                <span className="w-24 font-mono text-sm text-zinc-900 dark:text-zinc-100 truncate">{item.word}</span>
                <div className="flex-1 h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-400 dark:bg-zinc-600 rounded-full"
                    style={{ width: `${Math.min(item.percentage * 2, 100)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-zinc-500">{item.count}次</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
