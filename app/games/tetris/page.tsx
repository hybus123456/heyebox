"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const COLS = 10;
const ROWS = 20;

const SHAPES: Record<string, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

const SHAPE_COLORS: Record<string, string> = {
  I: "bg-cyan-400",
  O: "bg-yellow-400",
  T: "bg-purple-400",
  S: "bg-green-400",
  Z: "bg-red-400",
  J: "bg-blue-400",
  L: "bg-orange-400",
};

const SHAPE_NAMES = Object.keys(SHAPES);

interface Piece {
  shape: number[][];
  type: string;
  x: number;
  y: number;
}

function createPiece(): Piece {
  const type = SHAPE_NAMES[Math.floor(Math.random() * SHAPE_NAMES.length)];
  const shape = SHAPES[type].map((row) => [...row]);
  return {
    shape,
    type,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
  };
}

function rotateMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;
  const rotated = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotated[j][n - 1 - i] = matrix[i][j];
    }
  }
  return rotated;
}

export default function TetrisPage() {
  const [screen, setScreen] = useState<"start" | "game" | "result">("start");
  const [board, setBoard] = useState<number[][]>([]);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);

  const boardRef = useRef<number[][]>([]);
  const pieceRef = useRef<Piece | null>(null);
  const nextPieceRef = useRef<Piece | null>(null);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const linesRef = useRef(0);
  const gameOverRef = useRef(false);
  const dropTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getSpeed = useCallback(() => {
    return Math.max(120, 900 - (levelRef.current - 1) * 100);
  }, []);

  const createEmptyBoard = useCallback(() => {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }, []);

  const isValidPosition = useCallback(
    (shape: number[][], x: number, y: number, board: number[][]): boolean => {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const newX = x + c;
            const newY = y + r;
            if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
            if (newY >= 0 && board[newY][newX]) return false;
          }
        }
      }
      return true;
    },
    []
  );

  const lockPiece = useCallback(() => {
    const piece = pieceRef.current;
    const board = boardRef.current;
    if (!piece) return;

    const newBoard = board.map((row) => [...row]);
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const newY = piece.y + r;
          const newX = piece.x + c;
          if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
            newBoard[newY][newX] = piece.type.charCodeAt(0);
          }
        }
      }
    }

    let clearedLines = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r].every((cell) => cell !== 0)) {
        newBoard.splice(r, 1);
        newBoard.unshift(Array(COLS).fill(0));
        clearedLines++;
        r++;
      }
    }

    if (clearedLines > 0) {
      const lineScores = [0, 100, 300, 500, 800];
      scoreRef.current += lineScores[Math.min(clearedLines, 4)] * levelRef.current;
      linesRef.current += clearedLines;
      const newLevel = Math.floor(linesRef.current / 10) + 1;
      if (newLevel !== levelRef.current) {
        levelRef.current = newLevel;
        setLevel(newLevel);
      }
      setScore(scoreRef.current);
      setLines(linesRef.current);
    }

    boardRef.current = newBoard;
    setBoard(newBoard);

    const next = nextPieceRef.current || createPiece();
    pieceRef.current = next;
    setCurrentPiece(next);
    const generated = createPiece();
    nextPieceRef.current = generated;
    setNextPiece(generated);

    if (!isValidPosition(next.shape, next.x, next.y, newBoard)) {
      gameOverRef.current = true;
      if (dropTimerRef.current) clearInterval(dropTimerRef.current);
      setScreen("result");
    }

    restartDropTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidPosition]);

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      const piece = pieceRef.current;
      if (!piece || gameOverRef.current) return;
      if (isValidPosition(piece.shape, piece.x + dx, piece.y + dy, boardRef.current)) {
        piece.x += dx;
        piece.y += dy;
        setCurrentPiece({ ...piece, shape: piece.shape.map((r) => [...r]) });
        if (dy > 0) restartDropTimer();
      } else if (dy > 0) {
        lockPiece();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isValidPosition, lockPiece]
  );

  const rotatePiece = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece || gameOverRef.current || piece.type === "O") return;
    const rotated = rotateMatrix(piece.shape);
    if (isValidPosition(rotated, piece.x, piece.y, boardRef.current)) {
      piece.shape = rotated;
      setCurrentPiece({ ...piece, shape: rotated.map((r) => [...r]) });
    } else if (isValidPosition(rotated, piece.x - 1, piece.y, boardRef.current)) {
      piece.shape = rotated;
      piece.x -= 1;
      setCurrentPiece({ ...piece, shape: rotated.map((r) => [...r]) });
    } else if (isValidPosition(rotated, piece.x + 1, piece.y, boardRef.current)) {
      piece.shape = rotated;
      piece.x += 1;
      setCurrentPiece({ ...piece, shape: rotated.map((r) => [...r]) });
    }
  }, [isValidPosition]);

  const hardDrop = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece || gameOverRef.current) return;
    while (isValidPosition(piece.shape, piece.x, piece.y + 1, boardRef.current)) {
      piece.y += 1;
    }
    setCurrentPiece({ ...piece, shape: piece.shape.map((r) => [...r]) });
    lockPiece();
  }, [isValidPosition, lockPiece]);

  const restartDropTimer = useCallback(() => {
    if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    dropTimerRef.current = setInterval(() => {
      movePiece(0, 1);
    }, getSpeed());
  }, [getSpeed, movePiece]);

  const startGame = useCallback(() => {
    const emptyBoard = createEmptyBoard();
    boardRef.current = emptyBoard;
    setBoard(emptyBoard);
    scoreRef.current = 0;
    levelRef.current = 1;
    linesRef.current = 0;
    gameOverRef.current = false;
    setScore(0);
    setLevel(1);
    setLines(0);

    const first = createPiece();
    const next = createPiece();
    pieceRef.current = first;
    nextPieceRef.current = next;
    setCurrentPiece(first);
    setNextPiece(next);
    setScreen("game");

    restartDropTimer();
  }, [createEmptyBoard, restartDropTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== "game") return;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          movePiece(-1, 0);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          movePiece(1, 0);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          movePiece(0, 1);
          break;
        case "ArrowUp":
        case "w":
        case "W":
          rotatePiece();
          break;
        case " ":
          hardDrop();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    };
  }, [screen, movePiece, rotatePiece, hardDrop]);

  const renderBoard = () => {
    const display = board.map((row) => [...row]);
    const piece = currentPiece;
    if (piece && screen === "game") {
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) {
            const newY = piece.y + r;
            const newX = piece.x + c;
            if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
              display[newY][newX] = piece.type.charCodeAt(0);
            }
          }
        }
      }
    }

    return (
      <div className="grid grid-cols-10 gap-px bg-zinc-700 dark:bg-zinc-600 p-1 rounded-lg">
        {display.map((row, r) =>
          row.map((cell, c) => {
            const type = cell ? String.fromCharCode(cell) : "";
            return (
              <div
                key={`${r}-${c}`}
                className={`aspect-square ${cell ? SHAPE_COLORS[type] || "bg-zinc-400" : "bg-zinc-900 dark:bg-zinc-800"}`}
              />
            );
          })
        )}
      </div>
    );
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;
    const shape = nextPiece.shape;
    return (
      <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${shape[0].length}, 20px)` }}>
        {shape.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`w-5 h-5 ${cell ? SHAPE_COLORS[nextPiece.type] || "bg-zinc-400" : "bg-transparent"}`}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {screen === "start" && (
        <div className="text-center">
          <div className="text-6xl mb-4">🟦</div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">俄罗斯方块</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">经典方块堆叠消行游戏</p>

          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">操作说明</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>⬅️➡️ A/D 或方向键左右移动</li>
              <li>⬆️ W 或上方向键旋转方块</li>
              <li>⬇️ S 或下方向键加速下落</li>
              <li>⏬ 空格键直接落底</li>
              <li>📊 每消10行升1级，速度加快</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            开始游戏
          </button>
        </div>
      )}

      {(screen === "game" || screen === "result") && (
        <div className="flex justify-center gap-6">
          <div className="w-[260px] sm:w-[300px]">{renderBoard()}</div>

          <div className="w-32 space-y-4">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <p className="text-xs text-zinc-500 mb-2">下一个</p>
              {renderNextPiece()}
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg space-y-2">
              <div>
                <p className="text-xs text-zinc-500">分数</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{score}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">等级</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{level}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">消行</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{lines}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "result" && (
        <div className="mt-6 text-center">
          <div className="inline-block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-4">
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">游戏结束</p>
            <p className="text-sm text-zinc-500">最终得分: {score} · 消行: {lines}</p>
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
              className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-750"
            >
              返回菜单
            </button>
          </div>
        </div>
      )}

      {screen === "game" && (
        <div className="mt-6 grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden">
          <div />
          <button onClick={rotatePiece} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">🔄</button>
          <div />
          <button onClick={() => movePiece(-1, 0)} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">⬅️</button>
          <button onClick={() => movePiece(0, 1)} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">⬇️</button>
          <button onClick={() => movePiece(1, 0)} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">➡️</button>
        </div>
      )}
    </div>
  );
}
