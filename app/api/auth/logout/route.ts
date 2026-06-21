import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("user_email");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to logout:", error);
    return NextResponse.json({ error: "退出失败" }, { status: 500 });
  }
}
