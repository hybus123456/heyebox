import { NextResponse } from "next/server";
import { getAllFeedbacks, addFeedback } from "@/lib/db";
import { verifyCaptchaToken } from "@/lib/captcha";

function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 2000);
}

export async function GET() {
  try {
    const feedbacks = await getAllFeedbacks();
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Failed to get feedbacks:", error);
    return NextResponse.json({ error: "获取反馈失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, content, captchaToken } = body;

    if (!type || !content) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    // Verify captcha
    if (!captchaToken || !verifyCaptchaToken(captchaToken)) {
      return NextResponse.json({ error: "请完成验证码" }, { status: 400 });
    }

    // Validate type
    const validTypes = ["bug", "feature", "other"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "无效的反馈类型" }, { status: 400 });
    }

    // Sanitize content
    const sanitizedContent = sanitizeInput(content);
    if (sanitizedContent.length < 2) {
      return NextResponse.json({ error: "反馈内容太短" }, { status: 400 });
    }

    const feedback = await addFeedback(type, sanitizedContent);
    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Failed to add feedback:", error);
    return NextResponse.json({ error: "提交反馈失败" }, { status: 500 });
  }
}
