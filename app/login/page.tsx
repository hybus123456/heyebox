"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Captcha } from "@/components/Captcha";
import { useUser } from "@/hooks/useUser";

export default function LoginPage() {
  const router = useRouter();
  const { refresh: refreshUser } = useUser();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");

  const handleCaptchaVerify = useCallback((verified: boolean, token?: string) => {
    setCaptchaVerified(verified);
    setCaptchaToken(token || "");
  }, []);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("请输入有效的邮箱地址");
      return;
    }

    if (!captchaVerified) {
      setError("请先完成验证码");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep("code");
        setSuccess("验证码已发送到您的邮箱");
        const userCheck = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
        const userData = await userCheck.json();
        setIsNewUser(!userData.exists);
      } else {
        setError(data.error || "发送失败");
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("请输入6位验证码");
      return;
    }

    if (isNewUser && !name.trim()) {
      setError("请输入您的昵称");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          code, 
          name: isNewUser ? name.trim() : undefined 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("登录成功！");
        await refreshUser();
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        setError(data.error || "验证失败");
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">荷叶box</span>
          </Link>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {step === "email" ? "登录 / 注册" : isNewUser ? "完成注册" : "验证登录"}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {step === "email" 
              ? "使用邮箱验证码快速登录或注册" 
              : `验证码已发送至 ${email}`
            }
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          {step === "email" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all"
                  required
                  autoFocus
                />
                <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  未注册的邮箱将自动创建账号
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  验证码
                </label>
                <Captcha onVerify={handleCaptchaVerify} />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !captchaVerified}
                className="w-full py-2.5 px-4 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    发送中...
                  </span>
                ) : (
                  "发送验证码"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-4">
              {isNewUser && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    设置昵称
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="给自己取个名字"
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all"
                    autoFocus
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  验证码
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="请输入6位验证码"
                  className="w-full px-3 py-2.5 text-center text-2xl font-mono tracking-[0.5em] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all"
                  maxLength={6}
                  autoFocus={!isNewUser}
                />
                <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  验证码10分钟内有效
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError("");
                    setSuccess("");
                  }}
                  className="flex-1 py-2.5 px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  返回
                </button>
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "验证中..." : isNewUser ? "注册并登录" : "登录"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            登录即表示同意{" "}
            <Link href="/about" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
              服务条款
            </Link>
            {" "}和{" "}
            <Link href="/about" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
              隐私政策
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
