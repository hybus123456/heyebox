"use client";

import { useState, useEffect } from "react";

export function GlassSettings() {
  const [opacity, setOpacity] = useState(70);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("glass-opacity");
    if (saved) {
      const val = parseInt(saved);
      setOpacity(val);
      document.documentElement.style.setProperty("--glass-opacity", (val / 100).toString());
    }
  }, []);

  const handleChange = (value: number) => {
    setOpacity(value);
    document.documentElement.style.setProperty("--glass-opacity", (value / 100).toString());
    localStorage.setItem("glass-opacity", value.toString());
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card w-10 h-10 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        aria-label="玻璃效果设置"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-64 p-4 glass-strong rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              玻璃透明度
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {opacity}%
            </span>
          </div>
          
          <input
            type="range"
            min="30"
            max="95"
            value={opacity}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between mt-2 text-xs text-zinc-400">
            <span>透明</span>
            <span>不透明</span>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-700/50">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              调整卡片和导航栏的玻璃效果透明度
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
