import { NextResponse } from "next/server";
import { getAllScores, addScore } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");
    const limit = parseInt(searchParams.get("limit") || "10");

    const scores = await getAllScores(gameId || undefined, limit);
    return NextResponse.json(scores);
  } catch (error) {
    console.error("Failed to get scores:", error);
    return NextResponse.json({ error: "获取成绩失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { gameId, playerName, score, level, details } = body;

    if (!gameId || score === undefined) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    const record = await addScore(gameId, playerName || "匿名", score, level, details);
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Failed to add score:", error);
    return NextResponse.json({ error: "保存成绩失败" }, { status: 500 });
  }
}
