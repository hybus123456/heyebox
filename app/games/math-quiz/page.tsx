"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Question {
  num1: number;
  num2: number;
  operator: string;
  answer: number;
}

const operators = ["+", "-", "×", "÷"];

function generateQuestion(difficulty: number): Question {
  let num1 = 1;
  let num2 = 1;
  let answer = 0;
  const opIndex = Math.floor(Math.random() * 4);
  const op = operators[opIndex];

  switch (difficulty) {
    case 1: // 简单：10以内加减
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      if (op === "-") {
        if (num1 < num2) [num1, num2] = [num2, num1];
      }
      break;
    case 2: // 中等�?00以内加减�?      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      break;
    case 3: // 困难：包含除�?      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      break;
    default:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
  }

  switch (op) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      if (num1 < num2) [num1, num2] = [num2, num1];
      answer = num1 - num2;
      break;
    case "×":
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
      break;
    case "÷":
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = Math.floor(Math.random() * 12) + 1;
      num1 = num2 * answer;
      break;
    default:
      answer = num1 + num2;
  }

  return { num1, num2, operator: op, answer };
}

export default function MathQuizPage() {
  const [screen, setScreen] = useState<"start" | "game" | "result">("start");
  const [difficulty, setDifficulty] = useState(2);
  const [timeLimit, setTimeLimit] = useState(60);
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "">("");
  const [isAnswering, setIsAnswering] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setScreen("game");
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTotalQuestions(0);
    setCorrectCount(0);
    setTimeLeft(timeLimit);
    setFeedback("");
    setUserAnswer("");
    setIsAnswering(false);
    setQuestion(generateQuestion(difficulty));

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setScreen("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [difficulty, timeLimit]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (screen === "game" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [screen, question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || isAnswering) return;

    setIsAnswering(true);
    const userNum = parseInt(userAnswer);
    setTotalQuestions((prev) => prev + 1);

    if (userNum === question.answer) {
      setFeedback("correct");
      const bonus = streak >= 5 ? 2 : 1;
      setScore((prev) => prev + 10 * bonus);
      setStreak((prev) => {
        const newStreak = prev + 1;
        setBestStreak((best) => Math.max(best, newStreak));
        return newStreak;
      });
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback("incorrect");
      setStreak(0);
    }

    setTimeout(() => {
      setQuestion(generateQuestion(difficulty));
      setUserAnswer("");
      setFeedback("");
      setIsAnswering(false);
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {screen === "start" && (
        <div className="text-center">
          <div className="text-6xl mb-4">🧮</div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            速算挑战
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            限时内完成尽可能多的计算�?          </p>

          <div className="flex justify-center gap-6 mb-8">
            <div>
              <label className="text-sm text-zinc-500 dark:text-zinc-400 block mb-2">难度</label>
              <div className="flex gap-2">
                {[
                  { value: 1, label: "简单" },
                  { value: 2, label: "中等" },
                  { value: 3, label: "困难" },
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      difficulty === d.value
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-zinc-500 dark:text-zinc-400 block mb-2">时间</label>
              <div className="flex gap-2">
                {[30, 60, 120].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeLimit(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeLimit === t
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {t}�?                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            开始挑�?          </button>
        </div>
      )}

      {screen === "game" && question && (
        <div>
          <div className="flex justify-between items-center mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                得分: <strong className="text-zinc-900 dark:text-zinc-100">{score}</strong>
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                连续: <strong className={`${streak >= 5 ? "text-orange-500" : "text-zinc-900 dark:text-zinc-100"}`}>{streak}</strong>
              </span>
            </div>
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-500" : "text-zinc-900 dark:text-zinc-100"}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {question.num1} {question.operator} {question.num2} = ?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex justify-center gap-4">
              <input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-32 px-4 py-3 text-2xl font-bold text-center rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                placeholder="?"
                disabled={isAnswering}
              />
              <button
                type="submit"
                disabled={isAnswering || !userAnswer}
                className="px-6 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
              >
                确认
              </button>
            </form>

            {feedback && (
              <div className={`mt-4 text-2xl font-bold ${feedback === "correct" ? "text-emerald-500" : "text-red-500"}`}>
                {feedback === "correct" ? "�?正确!" : `�?答案�?${question.answer}`}
              </div>
            )}
          </div>
        </div>
      )}

      {screen === "result" && (
        <div className="text-center">
          <div className="text-6xl mb-4">{accuracy >= 80 ? "🏆" : accuracy >= 60 ? "👍" : "💪"}</div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            时间到！
          </h2>

          <div className="inline-block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{score}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">总得分</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{correctCount}/{totalQuestions}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">正确/总题数</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-orange-500">{bestStreak}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">最佳连击</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{accuracy}%</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">正确率</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={startGame}
              className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              再来一局
            </button>
            <button
              onClick={() => setScreen("start")}
              className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700"
            >
              返回设置
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
