"use client";

import { useState, useEffect, useRef } from "react";

interface Chapter {
  id: number;
  name: string;
  insect: string;
  description: string;
}

const chapters: Chapter[] = [
  { id: 1, name: "蝉的地穴", insect: "蝉", description: "挖掘地穴，探索蝉的地下生活" },
  { id: 2, name: "螳螂捕猎", insect: "螳螂", description: "观察螳螂的捕猎技巧" },
  { id: 3, name: "蟋蟀的住宅", insect: "蟋蟀", description: "建造蟋蟀的精致住宅" },
];

export default function InsectGamePage() {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 450, y: 500 });
  const [insects, setInsects] = useState<{ x: number; y: number; id: number }[]>([]);
  const [obstacles, setObstacles] = useState<{ x: number; y: number; id: number }[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const playerPosRef = useRef(playerPos);
  const insectsRef = useRef(insects);
  const obstaclesRef = useRef(obstacles);

  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { insectsRef.current = insects; }, [insects]);
  useEffect(() => { obstaclesRef.current = obstacles; }, [obstacles]);

  const startChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setScore(0);
    setLives(3);
    setGameActive(true);
    setPlayerPos({ x: 450, y: 500 });
    setInsects([]);
    setObstacles([]);
  };

  useEffect(() => {
    if (!gameActive) return;

    const spawnInsect = () => {
      setInsects((prev) => [
        ...prev,
        {
          x: Math.random() * 800 + 50,
          y: Math.random() * 200 + 50,
          id: Date.now(),
        },
      ]);
    };

    const spawnObstacle = () => {
      setObstacles((prev) => [
        ...prev,
        {
          x: Math.random() * 800 + 50,
          y: Math.random() * 300 + 100,
          id: Date.now(),
        },
      ]);
    };

    const insectInterval = setInterval(spawnInsect, 2000);
    const obstacleInterval = setInterval(spawnObstacle, 3000);

    return () => {
      clearInterval(insectInterval);
      clearInterval(obstacleInterval);
    };
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const checkCollisions = () => {
      const player = playerPosRef.current;
      const currentInsects = insectsRef.current;
      const currentObstacles = obstaclesRef.current;

      currentInsects.forEach((insect) => {
        const dx = player.x - insect.x;
        const dy = player.y - insect.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30) {
          setScore((prev) => prev + 10);
          setInsects((prev) => prev.filter((i) => i.id !== insect.id));
        }
      });

      currentObstacles.forEach((obstacle) => {
        const dx = player.x - obstacle.x;
        const dy = player.y - obstacle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 25) {
          setLives((prev) => {
            if (prev <= 1) {
              setGameActive(false);
              return 0;
            }
            return prev - 1;
          });
          setObstacles((prev) => prev.filter((o) => o.id !== obstacle.id));
        }
      });

      animFrameRef.current = requestAnimationFrame(checkCollisions);
    };

    animFrameRef.current = requestAnimationFrame(checkCollisions);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameActive]);

  const handleMove = (dx: number, dy: number) => {
    setPlayerPos((prev) => ({
      x: Math.max(20, Math.min(880, prev.x + dx)),
      y: Math.max(20, Math.min(580, prev.y + dy)),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {!selectedChapter ? (
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            昆虫记
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            基于法布尔《昆虫记》的科普游戏，通过不同章节了解昆虫知识。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => startChapter(chapter)}
                className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all text-left"
              >
                <div className="text-3xl mb-3">
                  {chapter.id === 1 ? "🦗" : chapter.id === 2 ? "🦟" : "🐛"}
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  第{chapter.id}章：{chapter.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {chapter.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              第{selectedChapter.id}章：{selectedChapter.name}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              分数: <strong className="text-zinc-900 dark:text-zinc-100">{score}</strong>
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              生命: <strong className="text-red-500">{"❤️".repeat(lives)}</strong>
            </span>
          </div>

          <div
            ref={gameAreaRef}
            className="relative w-full h-[600px] bg-gradient-to-b from-sky-100 to-green-100 dark:from-sky-900 dark:to-green-900 rounded-lg overflow-hidden"
            tabIndex={0}
            onKeyDown={(e) => {
              switch (e.key) {
                case "ArrowUp": case "w": case "W": handleMove(0, -20); break;
                case "ArrowDown": case "s": case "S": handleMove(0, 20); break;
                case "ArrowLeft": case "a": case "A": handleMove(-20, 0); break;
                case "ArrowRight": case "d": case "D": handleMove(20, 0); break;
              }
            }}
          >
            <div
              className="absolute w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs"
              style={{ left: playerPos.x - 16, top: playerPos.y - 16 }}
            >
              👤
            </div>

            {insects.map((insect) => (
              <div
                key={insect.id}
                className="absolute w-6 h-6 text-lg"
                style={{ left: insect.x - 12, top: insect.y - 12 }}
              >
                🦗
              </div>
            ))}

            {obstacles.map((obstacle) => (
              <div
                key={obstacle.id}
                className="absolute w-6 h-6 text-lg"
                style={{ left: obstacle.x - 12, top: obstacle.y - 12 }}
              >
                🪨
              </div>
            ))}

            {!gameActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <p className="text-2xl font-bold mb-4">游戏结束</p>
                  <p className="mb-4">最终得分：{score}</p>
                  <button
                    onClick={() => setSelectedChapter(null)}
                    className="px-4 py-2 bg-white text-zinc-900 rounded-lg"
                  >
                    返回章节选择
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => handleMove(0, -20)}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
            >
              ↑
            </button>
            <button
              onClick={() => handleMove(-20, 0)}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
            >
              ←
            </button>
            <button
              onClick={() => handleMove(20, 0)}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
            >
              →
            </button>
            <button
              onClick={() => handleMove(0, 20)}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
            >
              ↓
            </button>
          </div>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
            使用 WASD 或方向键移动，收集昆虫，躲避障碍
          </p>
        </div>
      )}
    </div>
  );
}
