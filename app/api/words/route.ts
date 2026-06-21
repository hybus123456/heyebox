import { NextResponse } from "next/server";
import wordsData from "./words.json";

const words = wordsData as Record<string, string[]>;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = parseInt(searchParams.get("level") || "1");
  const count = parseInt(searchParams.get("count") || "5");

  const levelWords = words[level.toString()] || words["1"];
  const shuffled = [...levelWords].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return NextResponse.json(selected);
}
