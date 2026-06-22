"use client";

import { useState, useCallback } from "react";
import { Captcha } from "@/components/Captcha";
import { FadeIn } from "@/components/Animations";

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState("bug");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");

  const handleCaptchaVerify = useCallback((verified: boolean, token?: string) => {
    setCaptchaVerified(verified);
    setCaptchaToken(token || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!captchaVerified) {
      setError("请先完成验证码");
      return;
    }

    setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: feedbackType, 
          content: content.trim(),
          captchaToken 
        }),
      });

      if (response.ok) {
        setContent("");
        setSubmitted(true);
        setCaptchaVerified(false);
        setCaptchaToken("");
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const data = await response.json();
        setError(data.error || "提交失败，请重试");
      }
    } catch {
      setError("网络错误，请重试");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeIn>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            反馈
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            您的反馈对我们非常重要，我们会认真处理每一条建议
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                反馈类型
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              >
                <option value="bug">报告问题</option>
                <option value="feature">功能建议</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                详细描述
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 resize-none"
                placeholder="请详细描述您的问题或建议..."
                required
              />
              <p className="mt-1 text-xs text-zinc-400">
                {content.length}/2000
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                验证码
              </label>
              <Captcha onVerify={handleCaptchaVerify} />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {submitted && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  感谢您的反馈！我们会认真处理您的建议。
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!captchaVerified || content.length < 2}
              className="w-full py-3 px-6 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              提交反馈
            </button>
          </form>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <div className="mt-10 p-6 glass-card rounded-2xl">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            其他联系方式
          </h2>
          <div className="space-y-3">
            <a
              href="https://space.bilibili.com/2105587530"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Bilibili</p>
                <p className="text-xs text-zinc-500">@作者主页</p>
              </div>
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
