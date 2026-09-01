"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Bullet {
  x: number;
  y: number;
  vy: number;
}

interface Enemy {
  x: number;
  y: number;
  type: "normal" | "fast" | "tank";
  hp: number;
  width: number;
  height: number;
  vy: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: "shield" | "triple" | "slow";
  vy: number;
}

export default function SpaceShooterPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen] = useState<"start" | "game" | "result">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);

  const playerRef = useRef({ x: 400, y: 550, width: 40, height: 40 });
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const shieldRef = useRef(false);
  const tripleRef = useRef(false);
  const gameOverRef = useRef(false);
  const rafRef = useRef<number>(0);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shootTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastShotRef = useRef(0);

  const startGame = useCallback(() => {
    setScreen("game");
    setScore(0);
    setLives(3);
    setLevel(1);
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    shieldRef.current = false;
    tripleRef.current = false;
    gameOverRef.current = false;
    playerRef.current = { x: 400, y: 550, width: 40, height: 40 };
    bulletsRef.current = [];
    enemiesRef.current = [];
    powerUpsRef.current = [];
    lastShotRef.current = 0;

    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    spawnTimerRef.current = setInterval(spawnEnemy, 900);

    cancelAnimationFrame(rafRef.current);
    const loop = () => {
      update();
      draw();
      if (!gameOverRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    loop();
  }, []);

  const endGame = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    cancelAnimationFrame(rafRef.current);
    setScreen("result");
  }, []);

  const spawnEnemy = useCallback(() => {
    if (gameOverRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const roll = Math.random();
    let type: Enemy["type"] = "normal";
    let hp = 1;
    let width = 30;
    let height = 30;
    let vy = 1.5 + levelRef.current * 0.3;

    if (levelRef.current >= 2 && roll < 0.25) {
      type = "fast";
      width = 22;
      height = 22;
      vy = 2.5 + levelRef.current * 0.4;
    } else if (levelRef.current >= 3 && roll < 0.15) {
      type = "tank";
      hp = 3;
      width = 50;
      height = 50;
      vy = 0.8 + levelRef.current * 0.15;
    }

    enemiesRef.current.push({
      x: Math.random() * (canvas.width - 60) + 30,
      y: -height,
      type,
      hp,
      width,
      height,
      vy,
    });
  }, []);

  const shoot = useCallback(() => {
    if (gameOverRef.current) return;
    const now = Date.now();
    if (now - lastShotRef.current < 220) return;
    lastShotRef.current = now;

    const p = playerRef.current;
    if (tripleRef.current) {
      bulletsRef.current.push(
        { x: p.x - 12, y: p.y, vy: -8 },
        { x: p.x, y: p.y, vy: -8 },
        { x: p.x + 12, y: p.y, vy: -8 }
      );
    } else {
      bulletsRef.current.push({ x: p.x, y: p.y, vy: -8 });
    }
  }, []);

  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const p = playerRef.current;
    const speed = 5;

    if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a") || keysRef.current.has("A")) {
      p.x -= speed;
    }
    if (keysRef.current.has("ArrowRight") || keysRef.current.has("d") || keysRef.current.has("D")) {
      p.x += speed;
    }
    if (keysRef.current.has("ArrowUp") || keysRef.current.has("w") || keysRef.current.has("W")) {
      p.y -= speed;
    }
    if (keysRef.current.has("ArrowDown") || keysRef.current.has("s") || keysRef.current.has("S")) {
      p.y += speed;
    }
    p.x = Math.max(p.width / 2, Math.min(canvas.width - p.width / 2, p.x));
    p.y = Math.max(p.height / 2, Math.min(canvas.height - p.height / 2, p.y));

    bulletsRef.current = bulletsRef.current.filter((b) => b.y > -10);
    for (const bullet of bulletsRef.current) {
      bullet.y += bullet.vy;
    }

    for (const enemy of enemiesRef.current) {
      enemy.y += enemy.vy;
    }

    for (const bullet of bulletsRef.current) {
      for (const enemy of enemiesRef.current) {
        if (
          bullet.x > enemy.x - enemy.width / 2 &&
          bullet.x < enemy.x + enemy.width / 2 &&
          bullet.y > enemy.y - enemy.height / 2 &&
          bullet.y < enemy.y + enemy.height / 2
        ) {
          enemy.hp -= 1;
          bullet.y = -100;
          if (enemy.hp <= 0) {
            enemy.y = canvas.height + 100;
            const points = enemy.type === "tank" ? 100 : enemy.type === "fast" ? 40 : 20;
            scoreRef.current += points;
            setScore(scoreRef.current);

            if (Math.random() < 0.08) {
              const types: PowerUp["type"][] = ["shield", "triple", "slow"];
              powerUpsRef.current.push({
                x: enemy.x,
                y: enemy.y,
                type: types[Math.floor(Math.random() * types.length)],
                vy: 2,
              });
            }
          }
          break;
        }
      }
    }

    bulletsRef.current = bulletsRef.current.filter((b) => b.y > -100);
    enemiesRef.current = enemiesRef.current.filter((e) => e.y < canvas.height + 100 && e.hp > 0);

    for (const powerUp of powerUpsRef.current) {
      powerUp.y += powerUp.vy;
      if (
        powerUp.x > p.x - p.width / 2 &&
        powerUp.x < p.x + p.width / 2 &&
        powerUp.y > p.y - p.height / 2 &&
        powerUp.y < p.y + p.height / 2
      ) {
        powerUp.y = canvas.height + 100;
        if (powerUp.type === "shield") shieldRef.current = true;
        if (powerUp.type === "triple") tripleRef.current = true;
        if (powerUp.type === "slow") {
          enemiesRef.current.forEach((e) => (e.vy *= 0.5));
        }
      }
    }
    powerUpsRef.current = powerUpsRef.current.filter((p) => p.y < canvas.height + 100);

    for (const enemy of enemiesRef.current) {
      if (
        enemy.x > p.x - p.width / 2 &&
        enemy.x < p.x + p.width / 2 &&
        enemy.y > p.y - p.height / 2 &&
        enemy.y < p.y + p.height / 2
      ) {
        enemy.y = canvas.height + 100;
        if (shieldRef.current) {
          shieldRef.current = false;
        } else {
          livesRef.current -= 1;
          setLives(livesRef.current);
          if (livesRef.current <= 0) {
            endGame();
            return;
          }
        }
      }
    }
    enemiesRef.current = enemiesRef.current.filter((e) => e.y < canvas.height + 100);

    const newLevel = Math.floor(scoreRef.current / 500) + 1;
    if (newLevel !== levelRef.current) {
      levelRef.current = newLevel;
      setLevel(newLevel);
    }
  }, [endGame]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    const p = playerRef.current;
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - p.height / 2);
    ctx.lineTo(p.x - p.width / 2, p.y + p.height / 2);
    ctx.lineTo(p.x + p.width / 2, p.y + p.height / 2);
    ctx.closePath();
    ctx.fill();
    if (shieldRef.current) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 30, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "#fbbf24";
    for (const bullet of bulletsRef.current) {
      ctx.fillRect(bullet.x - 2, bullet.y - 8, 4, 12);
    }

    for (const enemy of enemiesRef.current) {
      if (enemy.type === "tank") {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);
        ctx.fillStyle = "#b91c1c";
        ctx.fillRect(enemy.x - enemy.width / 4, enemy.y - enemy.height / 4, enemy.width / 2, enemy.height / 2);
      } else if (enemy.type === "fast") {
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y - enemy.height / 2);
        ctx.lineTo(enemy.x - enemy.width / 2, enemy.y + enemy.height / 2);
        ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = "#a855f7";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const powerUp of powerUpsRef.current) {
      const colors = { shield: "#38bdf8", triple: "#fbbf24", slow: "#34d399" };
      ctx.fillStyle = colors[powerUp.type];
      ctx.fillRect(powerUp.x - 8, powerUp.y - 8, 16, 16);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === " ") {
        shoot();
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
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [shoot]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {screen === "start" && (
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">太空射击</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">驾驶飞船消灭入侵的敌人</p>

          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">操作说明</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>⌨️ WASD 或方向键移动飞船</li>
              <li>🔫 空格键射击（自动连射）</li>
              <li>💙 蓝色=护盾 黄色=三连射 绿色=减速</li>
              <li>❤️ 3条命，每500分升一级</li>
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
              等级: <strong className="text-zinc-900 dark:text-zinc-100">{level}</strong>
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
            WASD/方向键移动 · 空格射击 · 按住空格连射
          </p>
        </div>
      )}

      {screen === "result" && (
        <div className="text-center">
          <div className="text-6xl mb-4">{score >= 2000 ? "🏆" : score >= 1000 ? "🚀" : "💪"}</div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">游戏结束</h2>

          <div className="inline-block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{score}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">总分</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{level}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">到达等级</p>
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
