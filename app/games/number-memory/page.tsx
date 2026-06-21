"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function NumberMemoryPage() {
  const [screen, setScreen] = useState<"start" | "show" | "input" | "result">("start");
  const [level, setLevel] = useState(1);
  const [currentNumber, setCurrentNumber] = useState("");
  const [userInput, setUserInput] = useState("");
  const [showTime, setShowTime] = useState(3);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [maxLevel, setMaxLevel] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNumber = useCallback((len: number) => {
    let num = "";
    for (let i = 0; i < len; i++) {
      num += Math.floor(Math.random() * 10).toString();
    }
    return num;
  }, []);

  const startGame = useCallback(() => {
    setScreen("show");
    setLevel(1);
    setScore(0);
    const num = generateNumber(3);
    setCurrentNumber(num);
    setCountdown(showTime);
  }, [generateNumber, showTime]);

  const startLevel = useCallback((lvl: number) => {
    setScreen("show");
    const len = 2 + lvl;
    const num = generateNumber(len);
    setCurrentNumber(num);
    setCountdown(showTime);
  }, [generateNumber, showTime]);

  useEffect(() => {
    if (screen === "show") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setScreen("input");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      timerRef.current = timer;
      return () => clearInterval(timer);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === "input" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [screen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = userInput === currentNumber;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + level * 10);
      setMaxLevel((prev) => Math.max(prev, level));
    }

    setScreen("result");
  };

  const nextLevel = () => {
    if (isCorrect) {
      setLevel((prev) => prev + 1);
      startLevel(level + 1);
    } else {
      startGame();
    }
  };

  const numberLength = 2 + level;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {screen === "start" && (
        <div className="text-center">
          <div className="text-6xl mb-4">🔢</div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            数字记忆
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            记住数字并准确输入，挑战你的记忆力极限          </p>

          <div className="mb-8">
            <label className="text-sm text-zinc-500 dark:text-zinc-400 block mb-2">
              显示时间
            </label>
            <div className="flex justify-center gap-2">
              {[2, 3, 5].map((t) => (
                <button
                  key={t}
                  onClick={() => setShowTime(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showTime === t
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {t}秒                </button>
              ))}
            </div>
          </div>

          {maxLevel > 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              历史最高：{maxLevel} 级            </p>
          )}

          <button
            onClick={startGame}
            className="px-8 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            开始挑战          </button>
        </div>
      )}

      {screen === "show" && (
        <div className="text-center">
          <div className="mb-4">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              第 {level} 关 · {numberLength} 位数字            </span>
          </div>

          <div className="p-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
            <p className="text-6xl font-mono font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">
              {currentNumber}
            </p>
          </div>

          <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {countdown}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            记住这个数字！          </p>
        </div>
      )}

      {screen === "input" && (
        <div className="text-center">
          <div className="mb-4">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              第 {level} 关 · 请输入 {numberLength} 位数字            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, numberLength);
                setUserInput(val);
              }}
              className="w-full max-w-xs mx-auto block px-4 py-4 text-3xl font-mono font-bold text-center rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
              placeholder="?"
              maxLength={numberLength}
            />
            <button
              type="submit"
              disabled={userInput.length !== numberLength}
              className="px-8 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
            >
              确认
            </button>
          </form>
        </div>
      )}

      {screen === "result" && (
        <div className="text-center">
          <div className="text-6xl mb-4">{isCorrect ? "✓" : "✗"}</div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {isCorrect ? "正确！" : "错误！"}
          </h2>

          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl mb-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">正确答案</p>
            <p className="text-3xl font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {currentNumber}
            </p>
            {!isCorrect && (
              <>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 mb-2">你的答案</p>
                <p className="text-3xl font-mono font-bold text-red-500">
                  {userInput || "(空)"}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{score}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">得分</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{level}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">当前关卡</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={nextLevel}
              className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              {isCorrect ? "下一关" : "重新开始"}
            </button>
            <button
              onClick={() => setScreen("start")}
              className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700"
            >
              返回
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
