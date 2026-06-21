import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    if (!email) {
      return NextResponse.json({ user: null });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (error) {
    console.error("Failed to get user:", error);
    return NextResponse.json({ user: null });
  }
}
