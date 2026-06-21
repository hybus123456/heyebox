"use client";

import { useState, useCallback } from "react";

type Board = (number | null)[][];

const puzzles: Record<string, (number | null)[][]> = {
  easy: [
    [5,3,null,null,7,null,null,null,null],
    [6,null,null,1,9,5,null,null,null],
    [null,9,8,null,null,null,null,6,null],
    [8,null,null,null,6,null,null,null,3],
    [4,null,null,8,null,3,null,null,1],
    [7,null,null,null,2,null,null,null,6],
    [null,6,null,null,null,null,2,8,null],
    [null,null,null,4,1,9,null,null,5],
    [null,null,null,null,8,null,null,7,9],
  ],
  medium: [
    [null,null,null,2,6,null,7,null,1],
    [6,8,null,null,7,null,null,9,null],
    [1,9,null,null,null,4,5,null,null],
    [8,2,null,1,null,null,null,4,null],
    [null,null,4,6,null,2,9,null,null],
    [null,5,null,null,null,3,null,2,8],
    [null,null,9,3,null,null,null,7,4],
    [null,4,null,null,5,null,null,3,6],
    [7,null,3,null,1,8,null,null,null],
  ],
};

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium">("easy");
  const [board, setBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const startGame = useCallback(() => {
    const puzzle = puzzles[difficulty];
    const newBoard = puzzle.map(row => [...row]);
    const newInitial = puzzle.map(row => [...row]);
    setBoard(newBoard);
    setInitialBoard(newInitial);
    setSelectedCell(null);
    setErrors(new Set());
    setGameStarted(true);
    setGameCompleted(false);
  }, [difficulty]);

  const isValid = (board: Board, row: number, col: number, num: number): boolean => {
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === num) return false;
    }
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (r !== row || c !== col) {
          if (board[r][c] === num) return false;
        }
      }
    }
    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row]?.[col] !== null) return;
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameCompleted) return;
    const [row, col] = selectedCell;
    if (initialBoard[row]?.[col] !== null) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);

    const newErrors = new Set(errors);
    const key = `${row}-${col}`;
    if (!isValid(newBoard, row, col, num)) {
      newErrors.add(key);
    } else {
      newErrors.delete(key);
    }
    setErrors(newErrors);

    const isComplete = newBoard.every(row => row.every(cell => cell !== null));
    if (isComplete && newErrors.size === 0) {
      setGameCompleted(true);
    }
  };

  const handleClear = () => {
    if (!selectedCell || gameCompleted) return;
    const [row, col] = selectedCell;
    if (initialBoard[row]?.[col] !== null) return;
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = null;
    setBoard(newBoard);
    setErrors(prev => {
      const next = new Set(prev);
      next.delete(`${row}-${col}`);
      return next;
    });
  };

  if (!gameStarted) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🔢</div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">数独</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">经典数字逻辑游戏</p>

        <div className="mb-8">
          <label className="text-sm text-zinc-500 dark:text-zinc-400 block mb-2">选择难度</label>
          <div className="flex justify-center gap-3">
            {[{ value: "easy", label: "简单" }, { value: "medium", label: "中等" }].map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value as "easy" | "medium")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
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
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">数独</h1>
        <div className="flex gap-2">
          <button
            onClick={startGame}
            className="px-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            重新开始
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            清除
          </button>
        </div>
      </div>

      {gameCompleted && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">恭喜完成！</p>
        </div>
      )}

      <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-6">
        <div className="grid grid-cols-9 gap-px">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isInitial = initialBoard[r]?.[c] !== null;
              const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
              const hasError = errors.has(`${r}-${c}`);
              const isInSameRow = selectedCell?.[0] === r;
              const isInSameCol = selectedCell?.[1] === c;
              const isInSameBox = selectedCell && Math.floor(selectedCell[0] / 3) === Math.floor(r / 3) && Math.floor(selectedCell[1] / 3) === Math.floor(c / 3);

              let bgClass = "bg-white dark:bg-zinc-900";
              if (isSelected) bgClass = "bg-blue-100 dark:bg-blue-900/50";
              else if (isInSameRow || isInSameCol || isInSameBox) bgClass = "bg-zinc-50 dark:bg-zinc-800";

              let borderClass = "";
              if (c % 3 === 0 && c > 0) borderClass += " border-l-2 border-l-zinc-400 dark:border-l-zinc-600";
              if (r % 3 === 0 && r > 0) borderClass += " border-t-2 border-t-zinc-400 dark:border-t-zinc-600";

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`aspect-square flex items-center justify-center text-sm font-medium transition-colors ${bgClass} ${borderClass} ${
                    hasError ? "text-red-500" : isInitial ? "text-zinc-900 dark:text-zinc-100 font-bold" : "text-blue-600 dark:text-blue-400"
                  } ${!isInitial ? "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800" : ""}`}
                >
                  {cell || ""}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-9 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="aspect-square rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {num}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-center text-zinc-400 dark:text-zinc-500">
        点击空格选择，然后输入数字
      </p>
    </div>
  );
}
