import { NextResponse } from "next/server";
import { getAllScores, addScore } from "@/lib/db";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

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

    if (typeof gameId !== "string" || gameId.length > 50) {
      return NextResponse.json({ error: "无效的游戏ID" }, { status: 400 });
    }

    if (typeof score !== "number" || !isFinite(score) || score < 0 || score > 10000000) {
      return NextResponse.json({ error: "无效的分数" }, { status: 400 });
    }

    if (!rateLimit(getClientKey(request, "score"), 30, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "提交过于频繁" }, { status: 429 });
    }

    const safeName = playerName ? String(playerName).slice(0, 30) : "匿名";
    const record = await addScore(gameId, safeName, score, level, details);
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Failed to add score:", error);
    return NextResponse.json({ error: "保存成绩失败" }, { status: 500 });
  }
}
