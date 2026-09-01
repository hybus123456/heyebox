import { NextResponse } from "next/server";
import { createVerificationCode } from "@/lib/db";
import { sendVerificationCode } from "@/lib/email";
import { verifyPassToken } from "@/lib/captcha-store";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, captchaToken } = body;

    if (!rateLimit(getClientKey(request, "send-code"), 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "请输入有效的邮箱地址" }, { status: 400 });
    }

    if (!rateLimit(`send-email:${email.toLowerCase()}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "该邮箱请求过于频繁，请稍后再试" }, { status: 429 });
    }

    // Verify captcha
    if (!captchaToken || !verifyPassToken(captchaToken)) {
      return NextResponse.json({ error: "请完成验证码" }, { status: 400 });
    }

    const code = generateCode();
    await createVerificationCode(email, code);

    const sent = await sendVerificationCode(email, code);

    if (!sent) {
      return NextResponse.json({ error: "验证码发送失败，请稍后重试" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "验证码已发送到您的邮箱",
    });
  } catch (error) {
    console.error("Failed to send code:", error);
    return NextResponse.json({ error: "发送验证码失败" }, { status: 500 });
  }
}
