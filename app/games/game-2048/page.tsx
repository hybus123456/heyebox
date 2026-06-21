"use client";

import { useState, useEffect, useCallback } from "react";

type Board = number[][];

function createEmptyBoard(): Board {
  return Array(4).fill(null).map(() => Array(4).fill(0));
}

function addRandomTile(board: Board): Board {
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return board;
  const newBoard = board.map(row => [...row]);
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

function moveLeft(board: Board): { board: Board; score: number } {
  let score = 0;
  const newBoard = board.map(row => {
    const filtered = row.filter(v => v !== 0);
    const merged: number[] = [];
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        score += filtered[i] * 2;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }
    while (merged.length < 4) merged.push(0);
    return merged;
  });
  return { board: newBoard, score };
}

function rotate(board: Board): Board {
  return board[0].map((_, i) => board.map(row => row[i]).reverse());
}

function isGameOver(board: Board): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return false;
      if (c < 3 && board[r][c] === board[r][c + 1]) return false;
      if (r < 3 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

const tileColors: Record<number, string> = {
  0: "bg-zinc-100 dark:bg-zinc-800",
  2: "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100",
  4: "bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100",
  8: "bg-orange-200 dark:bg-orange-800 text-zinc-900 dark:text-zinc-100",
  16: "bg-orange-300 dark:bg-orange-700 text-zinc-900 dark:text-zinc-100",
  32: "bg-orange-400 dark:bg-orange-600 text-white",
  64: "bg-orange-500 dark:bg-orange-500 text-white",
  128: "bg-yellow-400 dark:bg-yellow-600 text-white",
  256: "bg-yellow-500 dark:bg-yellow-500 text-white",
  512: "bg-yellow-600 dark:bg-yellow-400 text-white",
  1024: "bg-red-500 dark:bg-red-500 text-white",
  2048: "bg-red-600 dark:bg-red-400 text-white",
};

export default function Game2048Page() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGame = useCallback(() => {
    let newBoard = createEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const move = useCallback((direction: "left" | "right" | "up" | "down") => {
    if (gameOver) return;

    let newBoard = board.map(row => [...row]);
    let rotations = 0;

    switch (direction) {
      case "left": rotations = 0; break;
      case "down": rotations = 1; break;
      case "right": rotations = 2; break;
      case "up": rotations = 3; break;
    }

    for (let i = 0; i < rotations; i++) newBoard = rotate(newBoard);
    const result = moveLeft(newBoard);
    for (let i = 0; i < (4 - rotations) % 4; i++) result.board = rotate(result.board);

    const changed = JSON.stringify(board) !== JSON.stringify(result.board);
    if (changed) {
      const updatedBoard = addRandomTile(result.board);
      setBoard(updatedBoard);
      setScore(prev => {
        const newScore = prev + result.score;
        if (newScore > bestScore) setBestScore(newScore);
        return newScore;
      });
      if (isGameOver(updatedBoard)) setGameOver(true);
    }
  }, [board, gameOver, bestScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": case "a": case "A": e.preventDefault(); move("left"); break;
        case "ArrowRight": case "d": case "D": e.preventDefault(); move("right"); break;
        case "ArrowUp": case "w": case "W": e.preventDefault(); move("up"); break;
        case "ArrowDown": case "s": case "S": e.preventDefault(); move("down"); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">2048</h1>
        <p className="text-zinc-600 dark:text-zinc-400">合并数字，达到2048！</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">分数</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{score}</p>
          </div>
          <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">最高分</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{bestScore}</p>
          </div>
        </div>
        <button
          onClick={initGame}
          className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          新游戏
        </button>
      </div>

      <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-xl">
        <div className="grid grid-cols-4 gap-2">
          {board.map((row, r) =>
            row.map((value, c) => (
              <div
                key={`${r}-${c}`}
                className={`aspect-square rounded-lg flex items-center justify-center text-lg font-bold transition-all ${
                  tileColors[value] || "bg-zinc-900 dark:bg-zinc-100 text-white"
                }`}
              >
                {value || ""}
              </div>
            ))
          )}
        </div>
      </div>

      {gameOver && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
          <p className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">游戏结束！</p>
          <p className="text-sm text-red-500 dark:text-red-400">最终得分: {score}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        <div />
        <button onClick={() => move("up")} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700">↑</button>
        <div />
        <button onClick={() => move("left")} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700">←</button>
        <button onClick={() => move("down")} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700">↓</button>
        <button onClick={() => move("right")} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700">→</button>
      </div>

      <p className="mt-4 text-xs text-center text-zinc-400 dark:text-zinc-500">
        使用 WASD 或方向键移动方块
      </p>
    </div>
  );
}
