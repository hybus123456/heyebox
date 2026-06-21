"use client";

import { useState, useCallback } from "react";

const solvableCombinations = [
  [1, 2, 3, 4], [1, 2, 5, 6], [1, 2, 5, 8], [1, 2, 6, 8],
  [1, 3, 4, 6], [1, 3, 5, 8], [1, 4, 5, 7], [1, 5, 5, 5],
  [1, 6, 6, 8], [1, 7, 7, 8], [2, 2, 5, 8], [2, 3, 4, 8],
  [2, 3, 6, 8], [2, 4, 4, 6], [2, 4, 6, 8], [2, 5, 5, 8],
  [2, 5, 6, 8], [2, 5, 7, 8], [2, 6, 6, 6], [2, 6, 6, 8],
  [2, 6, 7, 8], [2, 7, 7, 8], [3, 3, 4, 8], [3, 3, 5, 6],
  [3, 3, 5, 8], [3, 3, 6, 6], [3, 4, 4, 6], [3, 4, 4, 8],
  [3, 4, 6, 8], [3, 5, 5, 6], [3, 5, 5, 8], [3, 5, 6, 8],
  [3, 5, 7, 8], [3, 6, 6, 6], [3, 6, 6, 8], [3, 6, 7, 8],
  [3, 7, 7, 8], [3, 8, 8, 8], [4, 4, 4, 6], [4, 4, 4, 8],
  [4, 4, 5, 8], [4, 4, 6, 8], [4, 4, 7, 8], [4, 5, 5, 6],
  [4, 5, 5, 8], [4, 5, 6, 8], [4, 5, 7, 8], [4, 6, 6, 6],
  [4, 6, 6, 8], [4, 6, 7, 8], [4, 7, 7, 8], [4, 8, 8, 8],
  [5, 5, 5, 8], [5, 5, 6, 8], [5, 5, 7, 8], [5, 6, 6, 6],
  [5, 6, 6, 8], [5, 6, 7, 8], [5, 7, 7, 8], [5, 8, 8, 8],
  [6, 6, 6, 6], [6, 6, 6, 8], [6, 6, 7, 8], [6, 7, 7, 8],
  [6, 8, 8, 8], [7, 7, 7, 8], [7, 8, 8, 8], [8, 8, 8, 8],
];

function generateNumbers(): number[] {
  const combination = solvableCombinations[Math.floor(Math.random() * solvableCombinations.length)];
  return [...combination].sort(() => Math.random() - 0.5);
}

function safeEvaluate(expr: string): number | null {
  const sanitized = expr.replace(/[^0-9+\-*/().]/g, "");
  if (!sanitized) return null;

  let pos = 0;

  function peek(): string {
    return sanitized[pos] || "";
  }

  function consume(): string {
    return sanitized[pos++] || "";
  }

  function parseNumber(): number | null {
    const start = pos;
    if (peek() === "-" && (pos === 0 || "+-*/(".includes(sanitized[pos - 1]))) {
      consume();
    }
    while (peek() >= "0" && peek() <= "9") consume();
    if (peek() === ".") {
      consume();
      while (peek() >= "0" && peek() <= "9") consume();
    }
    if (pos === start) return null;
    const num = parseFloat(sanitized.slice(start, pos));
    return isNaN(num) ? null : num;
  }

  function parseExpr(): number | null {
    let left = parseTerm();
    if (left === null) return null;
    while (peek() === "+" || peek() === "-") {
      const op = consume();
      const right = parseTerm();
      if (right === null) return null;
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  function parseTerm(): number | null {
    let left = parseFactor();
    if (left === null) return null;
    while (peek() === "*" || peek() === "/") {
      const op = consume();
      const right = parseFactor();
      if (right === null) return null;
      if (op === "/") {
        if (right === 0) return null;
        left = left / right;
      } else {
        left = left * right;
      }
    }
    return left;
  }

  function parseFactor(): number | null {
    if (peek() === "(") {
      consume();
      const val = parseExpr();
      if (peek() !== ")") return null;
      consume();
      return val;
    }
    return parseNumber();
  }

  try {
    const result = parseExpr();
    if (pos !== sanitized.length) return null;
    if (result === null || !isFinite(result)) return null;
    return Math.round(result * 1000) / 1000;
  } catch {
    return null;
  }
}

export default function Math24Page() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [expression, setExpression] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info" | "">("");
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const startGame = useCallback(() => {
    setNumbers(generateNumbers());
    setExpression("");
    setMessage("");
    setMessageType("");
    setScore(0);
    setSolved(0);
    setSkipped(0);
    setGameStarted(true);
    setShowHint(false);
  }, []);

  const checkAnswer = () => {
    if (!expression.trim()) {
      setMessage("请输入表达式");
      setMessageType("error");
      return;
    }

    const usedNumbers = expression.match(/\d+/g)?.map(Number) || [];
    const sortedUsed = [...usedNumbers].sort((a, b) => a - b);
    const sortedNumbers = [...numbers].sort((a, b) => a - b);

    if (JSON.stringify(sortedUsed) !== JSON.stringify(sortedNumbers)) {
      setMessage("请使用所有4个数字，每个数字只能用一次");
      setMessageType("error");
      return;
    }

    const result = safeEvaluate(expression);
    if (result === null) {
      setMessage("表达式格式错误");
      setMessageType("error");
      return;
    }

    if (Math.abs(result - 24) < 0.001) {
      setMessage("正确！太棒了！");
      setMessageType("success");
      setScore((prev) => prev + 10);
      setSolved((prev) => prev + 1);
      setTimeout(() => {
        setNumbers(generateNumbers());
        setExpression("");
        setMessage("");
        setMessageType("");
        setShowHint(false);
      }, 1500);
    } else {
      setMessage(`结果是 ${result}，不是 24`);
      setMessageType("error");
    }
  };

  const skipQuestion = () => {
    setNumbers(generateNumbers());
    setExpression("");
    setMessage("");
    setMessageType("");
    setSkipped((prev) => prev + 1);
    setShowHint(false);
  };

  const getHint = () => {
    setShowHint(true);
    setMessage("提示：尝试使用括号改变运算顺序");
    setMessageType("info");
  };

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          24点游戏
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          使用4个数字通过加减乘除得到24
        </p>

        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">游戏规则</h3>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• 给你4个数字（1-10）</li>
            <li>• 使用 +、-、×、÷ 和括号</li>
            <li>• 每个数字必须且只能使用一次</li>
            <li>• 最终结果必须等于24</li>
          </ul>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            示例：1 2 3 4 → (1+2+3)×4 = 24
          </p>
        </div>

        <button
          onClick={startGame}
          className="px-8 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          开始游戏
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            得分: <strong className="text-zinc-900 dark:text-zinc-100">{score}</strong>
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            已解: <strong className="text-emerald-500">{solved}</strong>
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            跳过: <strong className="text-zinc-400">{skipped}</strong>
          </span>
        </div>
        <button
          onClick={() => setGameStarted(false)}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          退出
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="flex justify-center gap-3 mb-6">
          {numbers.map((num, index) => (
            <div
              key={index}
              className="w-16 h-16 flex items-center justify-center text-2xl font-bold bg-white dark:bg-zinc-800 rounded-xl border-2 border-zinc-200 dark:border-zinc-700"
            >
              {num}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            className="w-full max-w-md px-4 py-3 text-lg font-mono text-center rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
            placeholder="输入表达式，如 (1+2+3)×4"
          />
        </div>

        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={checkAnswer}
            className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            验证
          </button>
          <button
            onClick={getHint}
            disabled={showHint}
            className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            提示
          </button>
          <button
            onClick={skipQuestion}
            className="px-6 py-2 text-sm font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            跳过
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              messageType === "success"
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                : messageType === "error"
                ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          支持运算符: + - * / () · 示例: (1+2+3)*4
        </p>
      </div>
    </div>
  );
}
