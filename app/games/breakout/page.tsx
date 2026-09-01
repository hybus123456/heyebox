"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  alive: boolean;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface PowerUpDrop {
  x: number;
  y: number;
  type: "wide" | "multi";
  vy: number;
}

const brickColors = ["#ef4444", "#f97316", "#f59e0b", "#22c55e", "#3b82f6"];
const brickPoints = [50, 40, 30, 20, 10];

export default function BreakoutPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen] = useState<"start" | "game" | "result">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);

  const paddleRef = useRef({ x: 400, y: 570, width: 100, height: 12 });
  const ballsRef = useRef<Ball[]>([]);
  const bricksRef = useRef<Brick[]>([]);
  const dropsRef = useRef<PowerUpDrop[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const gameOverRef = useRef(false);
  const rafRef = useRef<number>(0);

  const initBricks = useCallback(() => {
    const bricks: Brick[] = [];
    const cols = 10;
    const rows = 5;
    const brickWidth = 70;
    const brickHeight = 22;
    const offsetX = (800 - cols * brickWidth - (cols - 1) * 8) / 2 + 4;
    const offsetY = 60;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offsetX + c * (brickWidth + 8),
          y: offsetY + r * (brickHeight + 6),
          width: brickWidth,
          height: brickHeight,
          color: brickColors[r],
          points: brickPoints[r] * (levelRef.current > 1 ? 2 : 1),
          alive: true,
        });
      }
    }
    return bricks;
  }, []);

  const endGame = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    cancelAnimationFrame(rafRef.current);
    setScreen("result");
  }, []);

  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const paddle = paddleRef.current;
    const speed = 6;
    if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a") || keysRef.current.has("A")) {
      paddle.x -= speed;
    }
    if (keysRef.current.has("ArrowRight") || keysRef.current.has("d") || keysRef.current.has("D")) {
      paddle.x += speed;
    }
    paddle.x = Math.max(paddle.width / 2, Math.min(canvas.width - paddle.width / 2, paddle.x));

    for (const ball of ballsRef.current) {
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.vx *= -1;
        ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
      }
      if (ball.y < ball.radius) {
        ball.vy = Math.abs(ball.vy);
      }

      if (
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x > paddle.x - paddle.width / 2 &&
        ball.x < paddle.x + paddle.width / 2 &&
        ball.vy > 0
      ) {
        const hitPos = (ball.x - paddle.x) / (paddle.width / 2);
        ball.vy = -Math.abs(ball.vy);
        ball.vx = hitPos * 5;
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        const targetSpeed = 5;
        ball.vx = (ball.vx / speed) * targetSpeed;
        ball.vy = (ball.vy / speed) * targetSpeed;
      }

      for (const brick of bricksRef.current) {
        if (!brick.alive) continue;
        if (
          ball.x > brick.x &&
          ball.x < brick.x + brick.width &&
          ball.y > brick.y &&
          ball.y < brick.y + brick.height
        ) {
          brick.alive = false;
          ball.vy *= -1;
          scoreRef.current += brick.points;
          setScore(scoreRef.current);

          if (Math.random() < 0.12) {
            dropsRef.current.push({
              x: brick.x + brick.width / 2,
              y: brick.y + brick.height,
              type: Math.random() < 0.5 ? "wide" : "multi",
              vy: 3,
            });
          }
          break;
        }
      }
    }

    ballsRef.current = ballsRef.current.filter((b) => b.y < canvas.height + 20);

    if (ballsRef.current.length === 0) {
      livesRef.current -= 1;
      setLives(livesRef.current);
      if (livesRef.current <= 0) {
        endGame();
        return;
      }
      ballsRef.current = [{ x: paddle.x, y: paddle.y - 15, vx: 3, vy: -4, radius: 7 }];
    }

    for (const drop of dropsRef.current) {
      drop.y += drop.vy;
      if (
        drop.y > paddle.y &&
        drop.y < paddle.y + paddle.height &&
        drop.x > paddle.x - paddle.width / 2 &&
        drop.x < paddle.x + paddle.width / 2
      ) {
        drop.y = canvas.height + 100;
        if (drop.type === "wide") {
          paddle.width = Math.min(180, paddle.width + 40);
        } else {
          const newBalls = ballsRef.current.map((b) => ({
            ...b,
            vx: -b.vx,
          }));
          ballsRef.current = [...ballsRef.current, ...newBalls];
        }
      }
    }
    dropsRef.current = dropsRef.current.filter((d) => d.y < canvas.height + 100);

    if (bricksRef.current.every((b) => !b.alive)) {
      levelRef.current += 1;
      setLevel(levelRef.current);
      bricksRef.current = initBricks();
      const paddle = paddleRef.current;
      ballsRef.current = [{ x: paddle.x, y: paddle.y - 15, vx: 3, vy: -4, radius: 7 }];
    }
  }, [endGame, initBricks]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const brick of bricksRef.current) {
      if (!brick.alive) continue;
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(brick.x, brick.y, brick.width, 3);
    }

    const paddle = paddleRef.current;
    ctx.fillStyle = "#f4f4f5";
    ctx.fillRect(paddle.x - paddle.width / 2, paddle.y, paddle.width, paddle.height);

    for (const ball of ballsRef.current) {
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const drop of dropsRef.current) {
      ctx.fillStyle = drop.type === "wide" ? "#38bdf8" : "#fbbf24";
      ctx.fillRect(drop.x - 8, drop.y - 8, 16, 16);
    }
  }, []);

  const startGame = useCallback(() => {
    setScreen("game");
    setScore(0);
    setLives(3);
    setLevel(1);
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    gameOverRef.current = false;
    paddleRef.current = { x: 400, y: 570, width: 100, height: 12 };
    bricksRef.current = initBricks();
    dropsRef.current = [];
    ballsRef.current = [{ x: 400, y: 540, vx: 3, vy: -4, radius: 7 }];

    cancelAnimationFrame(rafRef.current);
    const loop = () => {
      update();
      draw();
      if (!gameOverRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    loop();
  }, [initBricks, update, draw]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === " " && screen === "game" && ballsRef.current.length === 0) {
        startGame();
      }
      keysRef.current.add(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [screen, startGame]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {screen === "start" && (
        <div className="text-center">
          <div className="text-6xl mb-4">🧱</div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">打砖块</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">弹球消除所有砖块，挑战更高等级</p>

          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">操作说明</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>⌨️ A/D 或方向键移动挡板</li>
              <li>🔵 蓝色道具=加宽挡板</li>
              <li>🟡 黄色道具=分裂多球</li>
              <li>❤️ 3条命，球掉落扣1条</li>
              <li>🏆 清空砖块进入下一关</li>
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

      {screen === "game" && (
        <div>
          <div className="flex justify-between items-center mb-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              得分: <strong className="text-zinc-900 dark:text-zinc-100">{score}</strong>
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              关卡: <strong className="text-zinc-900 dark:text-zinc-100">{level}</strong>
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              生命: <strong className="text-red-500">{"❤️".repeat(Math.max(0, lives))}</strong>
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700"
          />

          <p className="mt-4 text-xs text-center text-zinc-400 dark:text-zinc-500">
            A/D 或方向键移动挡板
          </p>
        </div>
      )}

      {screen === "result" && (
        <div className="text-center">
          <div className="text-6xl mb-4">{score >= 3000 ? "🏆" : score >= 1500 ? "🧱" : "💪"}</div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">游戏结束</h2>

          <div className="inline-block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{score}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">总分</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{level}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">到达关卡</p>
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
              className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-750"
            >
              返回菜单
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
