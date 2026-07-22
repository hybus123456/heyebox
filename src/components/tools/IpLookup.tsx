"use client";

import { useState } from "react";

interface IpInfo {
  ip: string;
  country: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

export function IpLookup() {
  const [ip, setIp] = useState("");
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async (targetIp?: string) => {
    const queryIp = targetIp || ip;
    if (!queryIp && !targetIp) {
      setError("请输入IP地址");
      return;
    }

    setLoading(true);
    setError("");
    setInfo(null);

    try {
      const url = queryIp 
        ? `http://ip-api.com/json/${queryIp}?lang=zh-CN`
        : `http://ip-api.com/json/?lang=zh-CN`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "success") {
        setInfo(data);
      } else {
        setError("查询失败，请检查IP地址");
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const lookupMyIp = () => {
    setIp("");
    lookup("");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
          placeholder="输入IP地址（如 8.8.8.8）"
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        />
        <button
          onClick={() => lookup()}
          disabled={loading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? "查询中..." : "查询"}
        </button>
        <button
          onClick={lookupMyIp}
          disabled={loading}
          className="px-6 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50"
        >
          查我的IP
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {info && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "IP地址", value: info.ip },
            { label: "国家", value: info.country },
            { label: "地区", value: info.regionName },
            { label: "城市", value: info.city },
            { label: "邮编", value: info.zip },
            { label: "时区", value: info.timezone },
            { label: "经纬度", value: `${info.lat}, ${info.lon}` },
            { label: "ISP", value: info.isp },
            { label: "组织", value: info.org },
            { label: "AS", value: info.as },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            >
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.value || "-"}</span>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          使用 ip-api.com 免费接口查询IP地理位置信息
        </p>
      </div>
    </div>
  );
}
