"use client";

import { useState, useEffect, useCallback } from "react";

interface Word {
  en: string;
  cn: string;
}

const wordBank: Word[] = [
  { en: "ambiguous", cn: "模棱两可的" },
  { en: "analogy", cn: "类比" },
  { en: "anticipate", cn: "预期" },
  { en: "apparent", cn: "明显的" },
  { en: "appreciate", cn: "感激" },
  { en: "arbitrary", cn: "任意的" },
  { en: "articulate", cn: "清晰表达" },
  { en: "assertion", cn: "断言" },
  { en: "authentic", cn: "真实的" },
  { en: "beneficial", cn: "有益的" },
  { en: "bias", cn: "偏见" },
  { en: "capacity", cn: "能力" },
  { en: "circumstance", cn: "情况" },
  { en: "coherent", cn: "连贯的" },
  { en: "collaborate", cn: "合作" },
  { en: "comprehensive", cn: "全面的" },
  { en: "conceive", cn: "构想" },
  { en: "consecutive", cn: "连续的" },
  { en: "contemplate", cn: "沉思" },
  { en: "controversy", cn: "争议" },
  { en: "conventional", cn: "传统的" },
  { en: "crucial", cn: "关键的" },
  { en: "deliberate", cn: "故意的" },
  { en: "diminish", cn: "减少" },
  { en: "elaborate", cn: "精心制作" },
  { en: "eliminate", cn: "消除" },
  { en: "embrace", cn: "拥抱" },
  { en: "emerge", cn: "出现" },
  { en: "emphasize", cn: "强调" },
  { en: "endeavor", cn: "努力" },
  { en: "enhance", cn: "增强" },
  { en: "enormous", cn: "巨大的" },
  { en: "enthusiastic", cn: "热情的" },
  { en: "equivalent", cn: "等价的" },
  { en: "essence", cn: "本质" },
  { en: "exaggerate", cn: "夸大" },
  { en: "exceed", cn: "超过" },
  { en: "exclusive", cn: "排他的" },
  { en: "exploit", cn: "利用" },
  { en: "facilitate", cn: "促进" },
];

function generateOptions(current: Word, allWords: Word[]): string[] {
  const otherWords = allWords.filter((w) => w.cn !== current.cn);
  const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5);
  const wrongOptions = shuffledOthers.slice(0, 3).map((w) => w.cn);
  return [current.cn, ...wrongOptions].sort(() => Math.random() - 0.5);
}

export default function WordMemoryPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentPhase, setCurrentPhase] = useState<"study" | "test">("study");
  const [studyIndex, setStudyIndex] = useState(0);
  const [testWords, setTestWords] = useState<Word[]>([]);
  const [testIndex, setTestIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [wordCount, setWordCount] = useState(8);
  const [studyTime, setStudyTime] = useState(3);
  const [countdown, setCountdown] = useState(0);
  const [studyTimer, setStudyTimer] = useState<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    const shuffled = [...wordBank].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, wordCount);
    setWords(selected);
    setStudyIndex(0);
    setCurrentPhase("study");
    setScore(0);
    setGameStarted(true);
    setGameCompleted(false);
    setCountdown(studyTime);

    if (studyTimer) clearInterval(studyTimer);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setStudyTimer(timer);
  }, [wordCount, studyTime, studyTimer]);

  useEffect(() => {
    return () => {
      if (studyTimer) clearInterval(studyTimer);
    };
  }, [studyTimer]);

  const handleStudyTimeout = useCallback(() => {
    if (studyIndex < words.length - 1) {
      setStudyIndex((i) => i + 1);
      setCountdown(studyTime);
    } else {
      if (studyTimer) clearInterval(studyTimer);
      setCurrentPhase("test");
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setTestWords(shuffled);
      setTestIndex(0);
      setOptions(generateOptions(shuffled[0], words));
    }
  }, [studyIndex, words, studyTime, studyTimer]);

  useEffect(() => {
    if (countdown === 0 && currentPhase === "study" && gameStarted && !gameCompleted) {
      handleStudyTimeout();
    }
  }, [countdown, currentPhase, gameStarted, gameCompleted, handleStudyTimeout]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === testWords[testIndex].cn) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (testIndex < testWords.length - 1) {
      const nextIdx = testIndex + 1;
      setTestIndex(nextIdx);
      setSelectedAnswer("");
      setShowResult(false);
      setOptions(generateOptions(testWords[nextIdx], words));
    } else {
      setGameCompleted(true);
    }
  };

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          单词速记挑战
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          快速记忆单词，然后测试你的记忆力
        </p>
        <div className="flex justify-center gap-6 mb-8">
          <div>
            <label className="text-sm text-zinc-500 dark:text-zinc-400 block mb-1">单词数量</label>
            <select
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            >
              <option value={6}>6个</option>
              <option value={8}>8个</option>
              <option value={10}>10个</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-zinc-500 dark:text-zinc-400 block mb-1">每个单词时间</label>
            <select
              value={studyTime}
              onChange={(e) => setStudyTime(Number(e.target.value))}
              className="px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            >
              <option value={2}>2秒</option>
              <option value={3}>3秒</option>
              <option value={5}>5秒</option>
            </select>
          </div>
        </div>
        <button
          onClick={startGame}
          className="px-8 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          开始挑战
        </button>
      </div>
    );
  }

  if (gameCompleted) {
    const percentage = Math.round((score / words.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">{percentage >= 80 ? "🏆" : percentage >= 60 ? "👍" : "💪"}</div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          挑战完成！
        </h2>
        <div className="inline-block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl mb-6">
          <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {score}/{words.length}
          </p>
          <p className="text-zinc-500 dark:text-zinc-400">
            正确率 {percentage}%
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={startGame}
            className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            再来一局
          </button>
        </div>
      </div>
    );
  }

  if (currentPhase === "study") {
    const currentWord = words[studyIndex];
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="mb-6">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            记忆阶段 {studyIndex + 1}/{words.length}
          </span>
          <div className="mt-2 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${((studyIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
          <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {currentWord.en}
          </p>
          <p className="text-2xl text-blue-600 dark:text-blue-400">
            {currentWord.cn}
          </p>
        </div>

        <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {countdown}
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          记住这个单词！
        </p>
      </div>
    );
  }

  const currentTestWord = testWords[testIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          测试: <strong className="text-zinc-900 dark:text-zinc-100">{testIndex + 1}/{testWords.length}</strong>
        </span>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          得分: <strong className="text-zinc-900 dark:text-zinc-100">{score}</strong>
        </span>
      </div>

      <div className="text-center mb-8">
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {currentTestWord.en}
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            选择正确的中文意思
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => {
            let style = "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500";
            if (showResult) {
              if (option === currentTestWord.cn) {
                style = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400";
              } else if (option === selectedAnswer && option !== currentTestWord.cn) {
                style = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
              }
            }
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-lg border-2 text-left font-medium transition-all ${style}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="text-center">
          <button
            onClick={nextQuestion}
            className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            {testIndex < testWords.length - 1 ? "下一题" : "查看结果"}
          </button>
        </div>
      )}
    </div>
  );
}
