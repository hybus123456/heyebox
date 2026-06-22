import { NextResponse } from "next/server";
import { getAllFeedbacks, deleteFeedback } from "@/lib/db";
import { cookies } from "next/headers";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === "authenticated";
}

export async function GET() {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const feedbacks = await getAllFeedbacks();
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Failed to get feedbacks:", error);
    return NextResponse.json({ error: "获取反馈失败" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "缺少ID" }, { status: 400 });
    }

    await deleteFeedback(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete feedback:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
