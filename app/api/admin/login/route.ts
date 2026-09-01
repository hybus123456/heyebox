import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

export async function POST(request: Request) {
  try {
    if (!rateLimit(getClientKey(request, "admin-login"), 5, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "尝试次数过多，请15分钟后再试" }, { status: 429 });
    }

    if (!ADMIN_PASSWORD) {
      return NextResponse.json({ error: "管理员密码未配置" }, { status: 500 });
    }

    const body = await request.json();
    const { password } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
