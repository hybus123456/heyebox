import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "缺少邮箱参数" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Failed to check email:", error);
    return NextResponse.json({ exists: false });
  }
}
