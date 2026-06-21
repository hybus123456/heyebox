"use client";

import { useState, useEffect, useCallback } from "react";

interface FavoriteButtonProps {
  itemId: string;
  itemType: "tool" | "game";
}

export function FavoriteButton({ itemId, itemType }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkFavorite = useCallback(async () => {
    try {
      const response = await fetch(`/api/favorites?itemId=${itemId}&itemType=${itemType}`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
    } catch {
      console.error("Failed to check favorite");
    }
  }, [itemId, itemType]);

  useEffect(() => {
    checkFavorite();
  }, [checkFavorite]);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        await fetch(`/api/favorites?itemId=${itemId}&itemType=${itemType}`, {
          method: "DELETE",
        });
        setIsFavorite(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId, itemType }),
        });
        setIsFavorite(true);
      }
    } catch {
      console.error("Failed to toggle favorite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-lg transition-colors ${
        isFavorite
          ? "text-red-500 hover:text-red-600"
          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
      }`}
      aria-label={isFavorite ? "取消收藏" : "收藏"}
    >
      <svg
        className="w-5 h-5"
        fill={isFavorite ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
