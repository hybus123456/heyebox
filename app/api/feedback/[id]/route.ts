import { NextResponse } from "next/server";
import { deleteFeedback } from "@/lib/db";
import { cookies } from "next/headers";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get("admin_token")?.value !== "authenticated") {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;
    const feedbackId = parseInt(id, 10);

    if (isNaN(feedbackId)) {
      return NextResponse.json({ error: "无效的ID" }, { status: 400 });
    }

    await deleteFeedback(feedbackId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete feedback:", error);
    return NextResponse.json({ error: "删除反馈失败" }, { status: 500 });
  }
}
