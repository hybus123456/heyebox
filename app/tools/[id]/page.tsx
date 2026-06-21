"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { tools } from "@/lib/tools-data";
import { JsonFormatter } from "@/components/tools/JsonFormatter";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { UrlEncode } from "@/components/tools/UrlEncode";
import { ColorConverter } from "@/components/tools/ColorConverter";
import { TimestampTool } from "@/components/tools/TimestampTool";
import { HashGenerator } from "@/components/tools/HashGenerator";
import { ImageCompressor } from "@/components/tools/ImageCompressor";
import { RegexTester } from "@/components/tools/RegexTester";
import { UuidGenerator } from "@/components/tools/UuidGenerator";
import { UnitConverter } from "@/components/tools/UnitConverter";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { MarkdownPreview } from "@/components/tools/MarkdownPreview";
import { QrCodeGenerator } from "@/components/tools/QrCodeGenerator";
import { TextDiff } from "@/components/tools/TextDiff";
import { JsonToTs } from "@/components/tools/JsonToTs";
import { NumberBase } from "@/components/tools/NumberBase";
import { CronGenerator } from "@/components/tools/CronGenerator";
import { LoremGenerator } from "@/components/tools/LoremGenerator";
import { CssUnitConverter } from "@/components/tools/CssUnitConverter";
import { ColorPalette } from "@/components/tools/ColorPalette";
import { JsonViewer } from "@/components/tools/JsonViewer";
import { WordCounter } from "@/components/tools/WordCounter";
import { PasswordStrength } from "@/components/tools/PasswordStrength";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FadeIn } from "@/components/Animations";

const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatter,
  "base64": Base64Tool,
  "url-encode": UrlEncode,
  "color-converter": ColorConverter,
  "timestamp": TimestampTool,
  "hash": HashGenerator,
  "image-compressor": ImageCompressor,
  "regex-tester": RegexTester,
  "uuid-generator": UuidGenerator,
  "unit-converter": UnitConverter,
  "password-generator": PasswordGenerator,
  "markdown-preview": MarkdownPreview,
  "qr-code": QrCodeGenerator,
  "text-diff": TextDiff,
  "json-to-ts": JsonToTs,
  "number-base": NumberBase,
  "cron-generator": CronGenerator,
  "lorem-generator": LoremGenerator,
  "css-unit": CssUnitConverter,
  "color-palette": ColorPalette,
  "json-viewer": JsonViewer,
  "word-counter": WordCounter,
  "password-strength": PasswordStrength,
};

export default function ToolPage() {
  const params = useParams();
  const toolId = params.id as string;
  const tool = tools.find((t) => t.id === toolId);

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            工具未找到
          </h1>
          <Link
            href="/tools"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            返回工具列表 &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const ToolComponent = toolComponents[toolId];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeIn>
        <div className="mb-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回工具列表
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{tool.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {tool.name}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">{tool.description}</p>
              </div>
            </div>
            <FavoriteButton itemId={tool.id} itemType="tool" />
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          {ToolComponent ? <ToolComponent /> : <p>工具开发中...</p>}
        </div>
      </FadeIn>
    </div>
  );
}
