"use client";

import { useState, useRef } from "react";

type Difficulty = "easy" | "medium" | "hard";
type Mode = "10" | "20" | "timed";

const difficulties = {
  easy: { delayMin: 500, delayMax: 2000, targetSize: 80, timeout: 3000, multiplier: 1, name: "简单" },
  medium: { delayMin: 500, delayMax: 3000, targetSize: 60, timeout: 2500, multiplier: 1.5, name: "中等" },
  hard: { delayMin: 500, delayMax: 3000, targetSize: 40, timeout: 2000, multiplier: 2, name: "困难" },
};

export default function ReactionTestPage() {
  const [screen, setScreen] = useState<"home" | "game" | "result">("home");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [mode, setMode] = useState<Mode>("10");
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [targetVisible, setTargetVisible] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("");
  const [canClick, setCanClick] = useState(false);
  const [totalRounds, setTotalRounds] = useState(10);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const lastTargetTimeRef = useRef(0);
  const targetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundRef = useRef(0);
  const totalRoundsRef = useRef(10);

  const clearAllTimeouts = () => {
    if (targetTimeoutRef.current) {
      clearTimeout(targetTimeoutRef.current);
      targetTimeoutRef.current = null;
    }
    if (roundTimeoutRef.current) {
      clearTimeout(roundTimeoutRef.current);
      roundTimeoutRef.current = null;
    }
  };

  const startGame = () => {
    clearAllTimeouts();
    setScreen("game");
    setCurrentRound(0);
    roundRef.current = 0;
    setScore(0);
    setMisses(0);
    setReactionTimes([]);
    setTargetVisible(false);
    setCanClick(false);
    setMessage("");

    const totalRounds = mode === "timed" ? 999 : parseInt(mode);
    totalRoundsRef.current = totalRounds;
    setTotalRounds(totalRounds);

    setTimeout(() => {
      startRound();
    }, 1000);
  };

  const startRound = () => {
    roundRef.current += 1;
    setCurrentRound(roundRef.current);
    setTargetVisible(false);
    setCanClick(false);
    setMessage("等待目标...");

    const config = difficulties[difficulty];
    // eslint-disable-next-line react-hooks/purity -- 延迟在事件处理器中生成，非渲染期间
    const delay = Math.floor(Math.random() * (config.delayMax - config.delayMin + 1)) + config.delayMin;

    targetTimeoutRef.current = setTimeout(() => {
      lastTargetTimeRef.current = performance.now();
      setTargetVisible(true);
      setCanClick(true);
      setMessage("");

      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const maxX = rect.width - config.targetSize - 20;
        const maxY = rect.height - config.targetSize - 20;
        const x = Math.floor(Math.random() * Math.max(1, maxX)) + 10;
        const y = Math.floor(Math.random() * Math.max(1, maxY)) + 10;
        setTargetPos({ x, y });
      }

      roundTimeoutRef.current = setTimeout(() => {
        setTargetVisible(false);
        setCanClick(false);
        setMisses(prev => prev + 1);
        setMessage("超时！");

        setTimeout(() => {
          if (roundRef.current < totalRoundsRef.current) {
            startRound();
          } else {
            setScreen("result");
          }
        }, 1000);
      }, config.timeout);
    }, delay);
  };

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canClick) return;

    const reactionTime = performance.now() - lastTargetTimeRef.current;
    clearAllTimeouts();

    setCanClick(false);
    setTargetVisible(false);

    const config = difficulties[difficulty];
    const roundScore = Math.max(0, Math.round((100 - reactionTime / 100) * config.multiplier));

    setScore(prev => prev + roundScore);
    setReactionTimes(prev => [...prev, reactionTime]);
    setMessage(`${Math.round(reactionTime)}ms`);

    setTimeout(() => {
      if (roundRef.current < totalRoundsRef.current) {
        startRound();
      } else {
        setScreen("result");
      }
    }, 1000);
  };

  const handleAreaClick = () => {
    if (!canClick) return;
    clearAllTimeouts();
    setCanClick(false);
    setTargetVisible(false);
    setMisses(prev => prev + 1);
    setMessage("失误！");

    setTimeout(() => {
      if (roundRef.current < totalRoundsRef.current) {
        startRound();
      } else {
        setScreen("result");
      }
    }, 1000);
  };

  const avgReaction = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;
  const bestReaction = reactionTimes.length > 0 ? Math.round(Math.min(...reactionTimes)) : 0;
  const worstReaction = reactionTimes.length > 0 ? Math.round(Math.max(...reactionTimes)) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {screen === "home" && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            反应力测试          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            测试你的反应速度！当蓝色圆圈出现时尽快点击。          </p>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">选择难度</h3>
            <div className="flex justify-center gap-2">
              {Object.entries(difficulties).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key as Difficulty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    difficulty === key
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {config.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">游戏模式</h3>
            <div className="flex justify-center gap-2">
              {[
                { value: "10", label: "10 轮" },
                { value: "20", label: "20 轮" },
                { value: "timed", label: "限时 30 秒" },
              ].map(m => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value as Mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === m.value
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            开始游戏          </button>
        </div>
      )}

      {screen === "game" && (
        <div>
          <div className="flex justify-between items-center mb-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              轮次: <strong className="text-zinc-900 dark:text-zinc-100">{currentRound}/{mode === "timed" ? "∞" : totalRounds}</strong>
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              分数: <strong className="text-zinc-900 dark:text-zinc-100">{score}</strong>
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              失误: <strong className="text-zinc-900 dark:text-zinc-100">{misses}</strong>
            </span>
          </div>

          <div
            ref={gameAreaRef}
            className="relative w-full h-[400px] bg-zinc-100 dark:bg-zinc-800 rounded-lg cursor-pointer overflow-hidden select-none"
            onClick={handleAreaClick}
          >
            {targetVisible && (
              <div
                className="absolute rounded-full bg-blue-500 hover:bg-blue-600 active:scale-90 cursor-pointer transition-transform"
                style={{
                  width: difficulties[difficulty].targetSize,
                  height: difficulties[difficulty].targetSize,
                  left: targetPos.x,
                  top: targetPos.y,
                }}
                onClick={handleTargetClick}
                onMouseDown={(e) => e.preventDefault()}
              />
            )}

            {message && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className={`text-4xl font-bold drop-shadow-lg ${
                  message.includes("ms") ? "text-emerald-500" : "text-red-500"
                }`}>
                  {message}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                clearAllTimeouts();
                setScreen("home");
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              放弃
            </button>
          </div>
        </div>
      )}

      {screen === "result" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">游戏结束</h2>

          <div className="inline-block p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">最终得分</p>
            <p className="text-5xl font-bold text-emerald-500 mb-4">{score}</p>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">平均反应</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{avgReaction}ms</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">最快反应</p>
                <p className="text-lg font-bold text-emerald-500">{bestReaction}ms</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">最慢反应</p>
                <p className="text-lg font-bold text-red-500">{worstReaction}ms</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">失误次数</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{misses}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={startGame}
              className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              再来一局
            </button>
            <button
              onClick={() => setScreen("home")}
              className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
