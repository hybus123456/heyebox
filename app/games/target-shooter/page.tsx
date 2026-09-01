"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Target {
  id: number;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  moving: boolean;
  life: number;
  maxLife: number;
}

interface HitInfo {
  x: number;
  y: number;
  ring: number;
  score: number;
  life: number;
}

export default function TargetShooterPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen] = useState<"start" | "game" | "result">("start");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [shots, setShots] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [mode, setMode] = useState<"timed" | "practice">("timed");

  const targetsRef = useRef<Target[]>([]);
  const hitsRef = useRef<HitInfo[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const bestComboRef = useRef(0);
  const hitsCountRef = useRef(0);
  const shotsRef = useRef(0);
  const targetIdRef = useRef(0);
  const timeLeftRef = useRef(60);
  const gameOverRef = useRef(false);
  const rafRef = useRef<number>(0);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback((gameMode: "timed" | "practice") => {
    setMode(gameMode);
    setScreen("game");
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setHits(0);
    setShots(0);
    setAccuracy(100);
    setTimeLeft(gameMode === "timed" ? 60 : 0);

    targetsRef.current = [];
    hitsRef.current = [];
    scoreRef.current = 0;
    comboRef.current = 0;
    bestComboRef.current = 0;
    hitsCountRef.current = 0;
    shotsRef.current = 0;
    timeLeftRef.current = 60;
    gameOverRef.current = false;

    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    spawnTimerRef.current = setInterval(spawnTarget, 1200);

    if (countdownRef.current) clearInterval(countdownRef.current);
    if (gameMode === "timed") {
      countdownRef.current = setInterval(() => {
        timeLeftRef.current -= 1;
        setTimeLeft(timeLeftRef.current);
        if (timeLeftRef.current <= 0) {
          endGame();
        }
      }, 1000);
    }

    cancelAnimationFrame(rafRef.current);
    const loop = () => {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  }, []);

  const endGame = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    cancelAnimationFrame(rafRef.current);
    setScreen("result");
  }, []);

  const spawnTarget = useCallback(() => {
    if (gameOverRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const margin = 70;
    const x = margin + Math.random() * (canvas.width - margin * 2);
    const y = margin + Math.random() * (canvas.height - margin * 2);
    const moving = Math.random() < 0.4;
    const radius = 35 + Math.random() * 20;
    const speed = 1 + Math.random() * 2;

    targetsRef.current.push({
      id: targetIdRef.current++,
      x,
      y,
      radius,
      vx: moving ? (Math.random() < 0.5 ? -speed : speed) : 0,
      vy: moving ? (Math.random() < 0.5 ? -speed : speed) : 0,
      moving,
      life: 180,
      maxLife: 180,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouseRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleClick = useCallback(() => {
    if (screen !== "game" || gameOverRef.current) return;

    shotsRef.current += 1;
    setShots(shotsRef.current);

    const mouse = mouseRef.current;
    let bestHit: Target | null = null;
    let bestDist = Infinity;

    for (const target of targetsRef.current) {
      const dx = mouse.x - target.x;
      const dy = mouse.y - target.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < target.radius && dist < bestDist) {
        bestDist = dist;
        bestHit = target;
      }
    }

    if (bestHit) {
      const relativeDist = bestDist / bestHit.radius;
      const ring = Math.max(1, Math.min(10, Math.ceil((1 - relativeDist) * 10)));
      const gained = ring * 10;
      comboRef.current += 1;
      bestComboRef.current = Math.max(bestComboRef.current, comboRef.current);
      scoreRef.current += gained + comboRef.current * 2;
      hitsCountRef.current += 1;

      setScore(scoreRef.current);
      setCombo(comboRef.current);
      setBestCombo(bestComboRef.current);
      setHits(hitsCountRef.current);
      setAccuracy(Math.round((hitsCountRef.current / shotsRef.current) * 100));

      hitsRef.current.push({
        x: bestHit.x,
        y: bestHit.y,
        ring,
        score: gained,
        life: 40,
      });

      targetsRef.current = targetsRef.current.filter((t) => t.id !== bestHit!.id);
    } else {
      comboRef.current = 0;
      setCombo(0);
    }
  }, [screen]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f4f4f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#e4e4e7";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    for (const target of targetsRef.current) {
      target.x += target.vx;
      target.y += target.vy;
      target.life -= 1;

      if (target.x < target.radius || target.x > canvas.width - target.radius) {
        target.vx *= -1;
        target.x = Math.max(target.radius, Math.min(canvas.width - target.radius, target.x));
      }
      if (target.y < target.radius || target.y > canvas.height - target.radius) {
        target.vy *= -1;
        target.y = Math.max(target.radius, Math.min(canvas.height - target.radius, target.y));
      }

      const alpha = target.life < 30 ? target.life / 30 : 1;
      ctx.globalAlpha = alpha;

      for (let ring = 10; ring >= 1; ring--) {
        const ringRadius = (target.radius * ring) / 10;
        if (ring <= 3) ctx.fillStyle = "#ef4444";
        else if (ring <= 6) ctx.fillStyle = "#f59e0b";
        else if (ring <= 8) ctx.fillStyle = "#3b82f6";
        else ctx.fillStyle = "#fafafa";

        ctx.beginPath();
        ctx.arc(target.x, target.y, ringRadius, 0, Math.PI * 2);
        ctx.fill();

        if (ring === 10 || ring === 5) {
          ctx.strokeStyle = "#18181b";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
    }

    targetsRef.current = targetsRef.current.filter((t) => t.life > 0);

    for (const hit of hitsRef.current) {
      hit.life -= 1;
      const alpha = hit.life / 40;
      ctx.globalAlpha = alpha;
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = hit.ring >= 8 ? "#dc2626" : hit.ring >= 5 ? "#ea580c" : "#2563eb";
      ctx.fillText(`+${hit.score}`, hit.x, hit.y - 20);
      ctx.globalAlpha = 1;
    }
    hitsRef.current = hitsRef.current.filter((h) => h.life > 0);

    const mouse = mouseRef.current;
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mouse.x - 16, mouse.y);
    ctx.lineTo(mouse.x + 16, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 16);
    ctx.lineTo(mouse.x, mouse.y + 16);
    ctx.stroke();

    ctx.strokeStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
    ctx.stroke();
  }, []);

  useEffect(() => {
    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {screen === "start" && (
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">打靶射击</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">模拟FPS瞄准体验，点击靶心得分</p>

          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">游戏规则</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>① 鼠标移动瞄准（十字准星）</li>
              <li>② 点击射击，命中环数越高分越多</li>
              <li>③ 连续命中触发连击加成</li>
              <li>④ 移动靶比固定靶得分更高</li>
              <li>⑤ 限时模式60秒，挑战最高分</li>
            </ul>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => startGame("timed")}
              className="px-8 py-3 text-lg font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              限时挑战（60秒）
            </button>
            <button
              onClick={() => startGame("practice")}
              className="px-8 py-3 text-lg font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-750"
            >
              练习模式
            </button>
          </div>
        </div>
      )}

      {screen === "game" && (
        <div>
          <div className="flex justify-between items-center mb-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                得分: <strong className="text-zinc-900 dark:text-zinc-100">{score}</strong>
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                连击: <strong className={combo >= 5 ? "text-red-500" : "text-zinc-900 dark:text-zinc-100"}>{combo}</strong>
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                命中率: <strong className="text-zinc-900 dark:text-zinc-100">{accuracy}%</strong>
              </span>
            </div>
            {mode === "timed" && (
              <span className={`text-lg font-bold ${timeLeft <= 10 ? "text-red-500" : "text-zinc-900 dark:text-zinc-100"}`}>
                {formatTime(timeLeft)}
              </span>
            )}
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-none"
          />

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={endGame}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              结束游戏
            </button>
          </div>
        </div>
      )}

      {screen === "result" && (
        <div className="text-center">
          <div className="text-6xl mb-4">{score >= 1000 ? "🏆" : score >= 500 ? "🎯" : "💪"}</div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">射击结束</h2>

          <div className="inline-block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{score}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">总分</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-red-500">{bestCombo}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">最高连击</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{hits}/{shots}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">命中/射击</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{accuracy}%</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">命中率</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => startGame("timed")}
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
