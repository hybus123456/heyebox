"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const texts = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
  "To be or not to be, that is the question. Whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune.",
  "In the beginning was the Word, and the Word was with God, and the Word was God. All things were made through him.",
  "Life is what happens when you are busy making other plans. The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep your face always toward the sunshine.",
  "The best time to plant a tree was 20 years ago. The second best time is now. Do not wait for opportunity, create it.",
];

export default function TypingTestPage() {
  const [screen, setScreen] = useState<"start" | "typing" | "result">("start");
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = useCallback(() => {
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setText(randomText);
    setInput("");
    setErrors(0);
    setStartTime(0);
    setEndTime(0);
    setTimeLeft(duration);
    setScreen("typing");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [duration]);

  useEffect(() => {
    if (screen === "typing" && startTime > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setEndTime(Date.now());
            setScreen("result");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [screen, startTime]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (startTime === 0 && value.length > 0) {
      setStartTime(Date.now());
    }

    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    setInput(value);

    if (value.length === text.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setEndTime(Date.now());
      setScreen("result");
    }
  };

  const getWPM = () => {
    if (!startTime || !endTime) return 0;
    const minutes = (endTime - startTime) / 60000;
    const words = input.split(/\s+/).length;
    return Math.round(words / minutes);
  };

  const getAccuracy = () => {
    if (input.length === 0) return 100;
    const correct = input.split("").filter((char, i) => char === text[i]).length;
    return Math.round((correct / input.length) * 100);
  };

  // eslint-disable-next-line react-hooks/purity
  const getElapsedTime = () => {
    if (!startTime) return 0;
    return Math.round(((endTime || Date.now()) - startTime) / 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {screen === "start" && (
        <div className="text-center">
          <div className="text-6xl mb-4">⌨️</div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">打字速度测试</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">测试你的打字速度和准确率</p>

          <div className="mb-8">
            <label className="text-sm text-zinc-500 dark:text-zinc-400 block mb-2">测试时长</label>
            <div className="flex justify-center gap-2">
              {[30, 60, 120].map((t) => (
                <button
                  key={t}
                  onClick={() => setDuration(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    duration === t
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {t}秒
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startTest}
            className="px-8 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            开始测试
          </button>
        </div>
      )}

      {screen === "typing" && (
        <div>
          <div className="flex justify-between items-center mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              时间: <strong className={`text-lg ${timeLeft <= 10 ? "text-red-500" : "text-zinc-900 dark:text-zinc-100"}`}>{timeLeft}s</strong>
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              错误: <strong className="text-red-500">{errors}</strong>
            </span>
          </div>

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 mb-6">
            <p className="font-mono text-lg leading-relaxed">
              {text.split("").map((char, index) => {
                let className = "text-zinc-400 dark:text-zinc-600";
                if (index < input.length) {
                  className = input[index] === char 
                    ? "text-zinc-900 dark:text-zinc-100" 
                    : "text-red-500 bg-red-50 dark:bg-red-900/20";
                } else if (index === input.length) {
                  className = "text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-700 animate-pulse";
                }
                return (
                  <span key={index} className={className}>
                    {char}
                  </span>
                );
              })}
            </p>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            placeholder="开始输入..."
            autoFocus
          />

          <p className="mt-4 text-xs text-center text-zinc-400 dark:text-zinc-500">
            按照上方文本输入，错误会标红显示
          </p>
        </div>
      )}

      {screen === "result" && (
        <div className="text-center">
          <div className="text-6xl mb-4">{getWPM() >= 60 ? "🏆" : getWPM() >= 40 ? "👍" : "💪"}</div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">测试完成</h2>

          <div className="inline-block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{getWPM()}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">WPM</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{getAccuracy()}%</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">准确率</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{getElapsedTime()}s</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">用时</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-red-500">{errors}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">错误</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={startTest}
              className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              再来一次
            </button>
            <button
              onClick={() => setScreen("start")}
              className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-750"
            >
              返回
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
