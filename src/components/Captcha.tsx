"use client";

import { useState, useEffect, useCallback } from "react";
import { generateCaptchaToken } from "@/lib/captcha";

interface CaptchaChallenge {
  question: string;
  answer: number;
  token: string;
}

function generateChallenge(): CaptchaChallenge {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  
  let answer: number;
  let question: string;
  
  switch (op) {
    case "+": {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    }
    case "-": {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 10) + 1;
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    }
    case "×": {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      answer = a * b;
      question = `${a} × ${b}`;
      break;
    }
    default: {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      answer = a + b;
      question = `${a} + ${b}`;
    }
  }
  
  const token = generateCaptchaToken(answer);
  
  return { question, answer, token };
}

interface CaptchaProps {
  onVerify: (verified: boolean, token?: string) => void;
  className?: string;
}

export function Captcha({ onVerify, className = "" }: CaptchaProps) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const refresh = useCallback(() => {
    setChallenge(generateChallenge());
    setUserAnswer("");
    setVerified(false);
    setError(false);
    onVerify(false);
  }, [onVerify]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleVerify = () => {
    if (!challenge) return;
    
    const numAnswer = parseInt(userAnswer);
    if (numAnswer === challenge.answer) {
      setVerified(true);
      setError(false);
      onVerify(true, challenge.token);
    } else {
      setError(true);
      setVerified(false);
      onVerify(false);
      setTimeout(refresh, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  if (!challenge) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-mono text-sm text-zinc-900 dark:text-zinc-100 select-none">
          {challenge.question} = ?
        </div>
        <button
          type="button"
          onClick={refresh}
          className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          aria-label="刷新验证码"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => {
            setUserAnswer(e.target.value);
            setError(false);
          }}
          onKeyDown={handleKeyDown}
          className={`w-20 px-3 py-2 rounded-lg border text-sm text-center font-mono ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : verified
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
          } text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600`}
          placeholder="?"
          disabled={verified}
        />
        
        {!verified && (
          <button
            type="button"
            onClick={handleVerify}
            disabled={!userAnswer}
            className="px-3 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            验证
          </button>
        )}
        
        {verified && (
          <span className="text-green-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
