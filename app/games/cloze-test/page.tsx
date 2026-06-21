"use client";

import { useState } from "react";

interface Question {
  sentence: string;
  answer: string;
  options: string[];
  hint: string;
}

const questionBank: Question[] = [
  {
    sentence: "The company decided to _____ its operations to reduce costs.",
    answer: "streamline",
    options: ["streamline", "strengthen", "struggle", "stumble"],
    hint: "使...更高效",
  },
  {
    sentence: "She showed great _____ in dealing with the difficult situation.",
    answer: "resilience",
    options: ["resistance", "resilience", "reliance", "reluctance"],
    hint: "韧性、恢复力",
  },
  {
    sentence: "The new policy will _____ affect millions of people.",
    answer: "adversely",
    options: ["adversely", "advertedly", "advertently", "adversitely"],
    hint: "不利地",
  },
  {
    sentence: "The scientist made a _____ discovery that changed our understanding of physics.",
    answer: "groundbreaking",
    options: ["groundbreaking", "groundbroken", "groundbreak", "groundly"],
    hint: "开创性的",
  },
  {
    sentence: "We need to _____ the environmental impact of this project.",
    answer: "assess",
    options: ["access", "assess", "asset", "assist"],
    hint: "评估",
  },
  {
    sentence: "The company's profits have _____ increased over the past year.",
    answer: "substantially",
    options: ["substantial", "substantive", "substantially", "substantiate"],
    hint: "大幅度地",
  },
  {
    sentence: "The government plans to _____ new regulations on data privacy.",
    answer: "implement",
    options: ["imply", "improve", "implement", "implicate"],
    hint: "实施",
  },
  {
    sentence: "Her _____ to the team was invaluable during the crisis.",
    answer: "contribution",
    options: ["contraction", "contribution", "contradiction", "controversy"],
    hint: "贡献",
  },
  {
    sentence: "The research findings are _____ with previous studies.",
    answer: "consistent",
    options: ["consistent", "consisting", "consisted", "consistence"],
    hint: "一致的",
  },
  {
    sentence: "The company aims to _____ sustainable business practices.",
    answer: "adopt",
    options: ["adapt", "adopt", "adept", "admit"],
    hint: "采用",
  },
  {
    sentence: "The _____ of the new technology has been slow but steady.",
    answer: "adoption",
    options: ["adaptation", "adoption", "addition", "admission"],
    hint: "采用、采纳",
  },
  {
    sentence: "The report _____ that further investigation is needed.",
    answer: "indicates",
    options: ["indicates", "indicts", "indirects", "inducts"],
    hint: "表明",
  },
];

export default function ClozeTestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);

  const startGame = () => {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, questionCount));
    setCurrentIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === questions[currentIndex].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      setGameCompleted(true);
    }
  };

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          完形填空挑战
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          根据句子语境选择正确的单词填空
        </p>
        <div className="mb-6">
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">题目数量:</label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="px-3 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
          >
            <option value={5}>5题</option>
            <option value={10}>10题</option>
            <option value={15}>15题</option>
          </select>
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
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">{percentage >= 80 ? "🏆" : percentage >= 60 ? "👍" : "💪"}</div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          挑战完成！
        </h2>
        <div className="inline-block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl mb-6">
          <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {score}/{questions.length}
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

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          题目: <strong className="text-zinc-900 dark:text-zinc-100">{currentIndex + 1}/{questions.length}</strong>
        </span>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          得分: <strong className="text-zinc-900 dark:text-zinc-100">{score}</strong>
        </span>
      </div>

      <div className="mb-8">
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-4">
          <p className="text-lg text-zinc-900 dark:text-zinc-100 leading-relaxed">
            {currentQuestion.sentence.replace("_____", "________")}
          </p>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            提示：{currentQuestion.hint}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((option) => {
            let style = "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500";
            if (showResult) {
              if (option === currentQuestion.answer) {
                style = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400";
              } else if (option === selectedAnswer && option !== currentQuestion.answer) {
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
            {currentIndex < questions.length - 1 ? "下一题" : "查看结果"}
          </button>
        </div>
      )}
    </div>
  );
}
