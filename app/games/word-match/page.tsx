"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Card {
  id: number;
  content: string;
  type: "en" | "cn";
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
  pos?: string;
}

const wordPairs = [
  { en: "abandon", cn: "放弃", pos: "v." },
  { en: "ability", cn: "能力", pos: "n." },
  { en: "absorb", cn: "吸收", pos: "v." },
  { en: "abstract", cn: "抽象的", pos: "adj." },
  { en: "abundant", cn: "丰富的", pos: "adj." },
  { en: "accelerate", cn: "加速", pos: "v." },
  { en: "accurate", cn: "准确的", pos: "adj." },
  { en: "achieve", cn: "实现", pos: "v." },
  { en: "acknowledge", cn: "承认", pos: "v." },
  { en: "acquire", cn: "获得", pos: "v." },
  { en: "adapt", cn: "适应", pos: "v." },
  { en: "adequate", cn: "足够的", pos: "adj." },
  { en: "adjust", cn: "调整", pos: "v." },
  { en: "admire", cn: "钦佩", pos: "v." },
  { en: "admit", cn: "承认", pos: "v." },
  { en: "adopt", cn: "采用", pos: "v." },
  { en: "advance", cn: "前进", pos: "v./n." },
  { en: "advantage", cn: "优势", pos: "n." },
  { en: "advocate", cn: "提倡", pos: "v." },
  { en: "affect", cn: "影响", pos: "v." },
  { en: "afford", cn: "负担得起", pos: "v." },
  { en: "agency", cn: "机构", pos: "n." },
  { en: "agenda", cn: "议程", pos: "n." },
  { en: "aggressive", cn: "侵略的", pos: "adj." },
  { en: "allocate", cn: "分配", pos: "v." },
  { en: "alternative", cn: "替代的", pos: "adj./n." },
  { en: "ambiguous", cn: "模棱两可的", pos: "adj." },
  { en: "ambitious", cn: "有雄心的", pos: "adj." },
  { en: "analogy", cn: "类比", pos: "n." },
  { en: "analyze", cn: "分析", pos: "v." },
];

function createCards(pairCount: number): Card[] {
  const shuffled = [...wordPairs].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, pairCount);
  const newCards: Card[] = [];

  selected.forEach((pair, index) => {
    newCards.push({
      id: index * 2,
      content: pair.en,
      type: "en",
      pairId: index,
      isFlipped: false,
      isMatched: false,
      pos: pair.pos,
    });
    newCards.push({
      id: index * 2 + 1,
      content: pair.cn,
      type: "cn",
      pairId: index,
      isFlipped: false,
      isMatched: false,
    });
  });

  return newCards.sort(() => Math.random() - 0.5);
}

export default function WordMatchPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [pairCount, setPairCount] = useState(6);

  useEffect(() => {
    setCards(createCards(pairCount));
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameStarted(false);
    setGameCompleted(false);
    setTimer(0);
  }, [pairCount]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  const resetGame = () => {
    setCards(createCards(pairCount));
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameStarted(false);
    setGameCompleted(false);
    setTimer(0);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const card1 = cards.find((c) => c.id === newFlipped[0]);
      const card2 = cards.find((c) => c.id === newFlipped[1]);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === card1.pairId ? { ...c, isMatched: true } : c
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);

          if (matchedPairs + 1 === pairCount) {
            setGameCompleted(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPosColor = (pos?: string) => {
    if (!pos) return "";
    if (pos.includes("n.")) return "text-blue-500";
    if (pos.includes("v.")) return "text-green-500";
    if (pos.includes("adj.")) return "text-purple-500";
    if (pos.includes("adv.")) return "text-orange-500";
    return "text-zinc-400";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          单词配对记忆
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          翻开卡片，匹配英文单词和中文意思
        </p>
      </div>

      <div className="flex justify-between items-center mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            步数: <strong className="text-zinc-900 dark:text-zinc-100">{moves}</strong>
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            配对: <strong className="text-zinc-900 dark:text-zinc-100">{matchedPairs}/{pairCount}</strong>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            时间: <strong className="text-zinc-900 dark:text-zinc-100">{formatTime(timer)}</strong>
          </span>
          <select
            value={pairCount}
            onChange={(e) => setPairCount(Number(e.target.value))}
            className="px-2 py-1 text-sm rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
          >
            <option value={4}>4对</option>
            <option value={6}>6对</option>
            <option value={8}>8对</option>
            <option value={10}>10对</option>
          </select>
          <button
            onClick={resetGame}
            className="px-3 py-1 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            重新开始
          </button>
        </div>
      </div>

      {gameCompleted && (
        <div className="mb-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
            恭喜完成！
          </h2>
          <p className="text-emerald-600 dark:text-emerald-300">
            用了 {moves} 步，耗时 {formatTime(timer)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isFlipped || card.isMatched}
            className={`aspect-square rounded-xl text-lg font-medium transition-all duration-300 flex flex-col items-center justify-center ${
              card.isMatched
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-700"
                : card.isFlipped
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-300 dark:border-zinc-600"
                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-600"
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <>
                <span>{card.content}</span>
                {card.type === "en" && card.pos && (
                  <span className={`text-xs mt-1 ${getPosColor(card.pos)}`}>
                    {card.pos}
                  </span>
                )}
              </>
            ) : (
              "?"
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-500"></span> n. 名词
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500"></span> v. 动词
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-purple-500"></span> adj. 形容词
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-orange-500"></span> adv. 副词
        </span>
      </div>
    </div>
  );
}
