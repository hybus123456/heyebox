"use client";

import { useState, useEffect, useCallback } from "react";
import { Captcha } from "@/components/Captcha";
import { FadeIn, StaggerChildren } from "@/components/Animations";

interface Feedback {
  id: number;
  type: string;
  content: string;
  created_at: string;
}

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState("bug");
  const [content, setContent] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    
    fetch("/api/feedback")
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => {
        if (!cancelled) {
          setFeedbacks(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load feedbacks:", err);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        const newFeedback = await response.json();
        setFeedbacks([newFeedback, ...feedbacks]);
        setContent("");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "提交失败，请重试");
      }
    } catch {
      setError("网络错误，请重试");
    }
  };

  const deleteFeedback = async (id: number) => {
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFeedbacks(feedbacks.filter((f) => f.id !== id));
      }
    } catch {
      console.error("Failed to delete feedback");
    }
  };

  const typeLabels: Record<string, string> = {
    bug: "报告问题",
    feature: "功能建议",
    other: "其他",
  };

  const typeColors: Record<string, string> = {
    bug: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    feature: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    other: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            反馈
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            您的反馈对我们非常重要
          </p>
        </div>
      </FadeIn>

      <StaggerChildren staggerDelay={100} className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            联系方式
          </h2>
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-zinc-500 dark:text-zinc-400 w-16">GitHub:</span>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  提交 Issue
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-zinc-500 dark:text-zinc-400 w-16">Bilibili:</span>
                <a
                  href="https://space.bilibili.com/2105587530"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  @作者主页
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            提交反馈
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                反馈类型
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              >
                <option value="bug">报告问题</option>
                <option value="feature">功能建议</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                详细描述
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                placeholder="请描述您的问题或建议..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                验证码
              </label>
              <Captcha onVerify={handleCaptchaVerify} />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={!captchaVerified}
                className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                提交反馈
              </button>
              {submitted && (
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  提交成功！感谢您的反馈
                </span>
              )}
              {error && (
                <span className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </span>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            已提交的反馈 {!loading && `(${feedbacks.length})`}
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto"></div>
              <p className="mt-2 text-sm text-zinc-500">加载中...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <p className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              暂无反馈，期待您的建议！
            </p>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[feedback.type]}`}>
                        {typeLabels[feedback.type]}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {feedback.created_at}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteFeedback(feedback.id)}
                      className="text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {feedback.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </StaggerChildren>
    </div>
  );
}
