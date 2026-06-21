import { NextResponse } from "next/server";
import { verifyCode, getUserByEmail, createUser } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, name } = body;

    if (!email || !code) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    const isValid = await verifyCode(email, code);
    if (!isValid) {
      return NextResponse.json({ error: "验证码无效或已过期" }, { status: 400 });
    }

    // Get or create user
    let user = await getUserByEmail(email);
    if (!user) {
      user = await createUser(email, name);
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (error) {
    console.error("Failed to verify:", error);
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
