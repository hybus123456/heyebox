import { NextResponse } from "next/server";
import { getFavorites, addFavorite, removeFavorite, isFavorite } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const itemId = searchParams.get("itemId");
    const itemType = searchParams.get("itemType");

    if (itemId && itemType) {
      const isFav = await isFavorite(itemId, itemType);
      return NextResponse.json({ isFavorite: isFav });
    }

    const favorites = await getFavorites(type || undefined);
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Failed to get favorites:", error);
    return NextResponse.json({ error: "获取收藏失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, itemType } = body;

    if (!itemId || !itemType) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    const favorite = await addFavorite(itemId, itemType);
    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return NextResponse.json({ error: "添加收藏失败" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const itemType = searchParams.get("itemType");

    if (!itemId || !itemType) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    await removeFavorite(itemId, itemType);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return NextResponse.json({ error: "取消收藏失败" }, { status: 500 });
  }
}
