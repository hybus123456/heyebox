"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  videoFilters,
  videoFormats,
  audioFormats,
  resolutions,
  buildConvertCommand,
  buildFilterCommand,
  buildTrimCommand,
  buildAudioCommand,
  buildGifCommand,
  getVideoDuration,
  extractFrame,
  formatDuration,
  formatFileSize,
} from "@/lib/video-utils";

type Tab = "convert" | "compress" | "trim" | "filter" | "audio" | "gif";

const tabs: { id: Tab; name: string; icon: string }[] = [
  { id: "convert", name: "格式转换", icon: "🔄" },
  { id: "compress", name: "视频压缩", icon: "📦" },
  { id: "trim", name: "在线剪辑", icon: "✂️" },
  { id: "filter", name: "视频滤镜", icon: "🎨" },
  { id: "audio", name: "提取音频", icon: "🎵" },
  { id: "gif", name: "提取GIF", icon: "🎞️" },
];

export function VideoProcessor() {
  const [activeTab, setActiveTab] = useState<Tab>("convert");
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  const [format, setFormat] = useState("mp4");
  const [resolution, setResolution] = useState("original");
  const [quality, setQuality] = useState("23");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [filterId, setFilterId] = useState("none");
  const [framePreview, setFramePreview] = useState("");
  const [audioFormat, setAudioFormat] = useState("mp3");
  const [bitrate, setBitrate] = useState("192k");
  const [fps, setFps] = useState("10");
  const [gifWidth, setGifWidth] = useState(480);
  const [gifDuration, setGifDuration] = useState(3);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef<{ run: (args: string[]) => Promise<void>; writeFile: (name: string, data: Uint8Array) => Promise<void>; readFile: (name: string) => Promise<Uint8Array>; load: () => Promise<void> } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const loadFfmpeg = useCallback(async () => {
    if (ffmpegLoaded || ffmpegRef.current) return;

    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");
      const ffmpeg = new FFmpeg();

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.round(p * 100));
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${location.origin}/ffmpeg/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${location.origin}/ffmpeg/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      ffmpegRef.current = {
        run: async (args) => { await ffmpeg.exec(args); },
        writeFile: async (name, data) => { await ffmpeg.writeFile(name, data); },
        readFile: async (name) => {
          const data = await ffmpeg.readFile(name);
          if (typeof data === "string") {
            return new TextEncoder().encode(data);
          }
          return new Uint8Array(data);
        },
        load: async () => {},
      };
      setFfmpegLoaded(true);
    } catch (err) {
      setError("FFmpeg 加载失败，请检查网络连接");
      console.error(err);
    }
  }, [ffmpegLoaded]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      getVideoDuration(file).then((dur) => {
        setDuration(dur);
        setEndTime(dur);
      });
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("video/")) {
      setError("请选择视频文件");
      return;
    }
    setFile(selected);
    setError("");
    setSuccess("");
    setProgress(0);
  };

  const downloadResult = (data: Uint8Array, filename: string) => {
    const blob = new Blob([data.buffer as ArrayBuffer]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const processVideo = async (args: string[], outputName: string) => {
    if (!file || !ffmpegRef.current) return;

    setProcessing(true);
    setError("");
    setSuccess("");
    setProgress(0);

    try {
      const { fetchFile } = await import("@ffmpeg/util");
      await ffmpegRef.current.writeFile("input.mp4", await fetchFile(file));
      await ffmpegRef.current.run(args);
      const data = await ffmpegRef.current.readFile(outputName);
      downloadResult(data, outputName);
      setSuccess(`处理完成！已下载 ${outputName}`);
    } catch (err) {
      setError("处理失败，请检查文件格式");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleConvert = () => {
    const fmt = videoFormats.find((f) => f.id === format)!;
    const args = buildConvertCommand(fmt, resolution, quality);
    processVideo(args, `converted.${fmt.ext}`);
  };

  const handleCompress = () => {
    const fmt = videoFormats.find((f) => f.id === format) || videoFormats[0];
    const crf = quality;
    const args = [
      "-i", "input.mp4",
      "-c:v", "libx264",
      "-crf", crf,
      "-preset", "medium",
      "-c:a", "aac",
      "-b:a", "128k",
      "-y", "compressed.mp4",
    ];
    if (resolution !== "original") {
      args.splice(2, 0, "-vf", `scale=-2:${resolution}`);
    }
    processVideo(args, "compressed.mp4");
  };

  const handleTrim = () => {
    if (endTime <= startTime) {
      setError("结束时间必须大于开始时间");
      return;
    }
    const fmt = videoFormats.find((f) => f.id === format) || videoFormats[0];
    const args = buildTrimCommand(startTime, endTime, fmt);
    processVideo(args, `trimmed.${fmt.ext}`);
  };

  const handleFilter = () => {
    const filter = videoFilters.find((f) => f.id === filterId);
    if (!filter || !filter.filter) {
      setError("请选择滤镜");
      return;
    }
    const fmt = videoFormats.find((f) => f.id === format) || videoFormats[0];
    const args = buildFilterCommand(filter.filter, fmt);
    processVideo(args, `filtered.${fmt.ext}`);
  };

  const handleAudio = () => {
    const fmt = audioFormats.find((f) => f.id === audioFormat)!;
    const args = buildAudioCommand(fmt, bitrate);
    processVideo(args, `audio.${fmt.ext}`);
  };

  const handleGif = () => {
    const args = buildGifCommand(startTime, gifDuration, fps, gifWidth);
    processVideo(args, "output.gif");
  };

  const previewFrame = async (time: number) => {
    if (!file) return;
    const frame = await extractFrame(file, time);
    setFramePreview(frame);
  };

  const handleFilterPreview = async () => {
    await previewFrame(startTime + 1);
  };

  const renderUploadArea = () => (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-2xl p-10 text-center cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <svg className="w-12 h-12 mx-auto mb-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <p className="text-zinc-600 dark:text-zinc-400">点击选择视频文件</p>
      <p className="text-xs text-zinc-400 mt-2">支持 MP4、WebM、MOV、AVI、MKV 等格式</p>
    </div>
  );

  const renderFileInfo = () => (
    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
        <p className="text-xs text-zinc-500 mb-1">文件名</p>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{file?.name}</p>
      </div>
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
        <p className="text-xs text-zinc-500 mb-1">大小</p>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{file ? formatFileSize(file.size) : "-"}</p>
      </div>
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
        <p className="text-xs text-zinc-500 mb-1">时长</p>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{formatDuration(duration)}</p>
      </div>
    </div>
  );

  const renderPreview = () => (
    videoUrl && (
      <div className="mb-4">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full rounded-xl bg-black max-h-64"
        />
      </div>
    )
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "convert":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">输出格式</label>
              <div className="flex flex-wrap gap-2">
                {videoFormats.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      format === f.id
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">分辨率</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                {resolutions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                质量 (CRF): {quality}
              </label>
              <input
                type="range"
                min="18"
                max="35"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-zinc-400">
                <span>高质量</span>
                <span>低质量</span>
              </div>
            </div>
          </div>
        );

      case "compress":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">压缩质量</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "18", label: "高质量" },
                  { value: "28", label: "中等" },
                  { value: "35", label: "低质量(小)" },
                ].map((q) => (
                  <button
                    key={q.value}
                    onClick={() => setQuality(q.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      quality === q.value
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">分辨率</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                {resolutions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case "trim":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                开始时间: {formatDuration(startTime)}
              </label>
              <input
                type="range"
                min="0"
                max={Math.max(duration, 0.1)}
                step="0.1"
                value={Math.min(startTime, duration)}
                onChange={(e) => setStartTime(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                结束时间: {formatDuration(endTime)}
              </label>
              <input
                type="range"
                min="0"
                max={Math.max(duration, 0.1)}
                step="0.1"
                value={Math.min(endTime, duration)}
                onChange={(e) => setEndTime(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">开始 (秒)</label>
                <input
                  type="number"
                  value={startTime}
                  onChange={(e) => setStartTime(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">结束 (秒)</label>
                <input
                  type="number"
                  value={endTime}
                  onChange={(e) => setEndTime(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => previewFrame(startTime)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                预览开始帧
              </button>
              <button
                onClick={() => previewFrame(endTime)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                预览结束帧
              </button>
            </div>
            {framePreview && (
              <div className="mt-2">
                <img src={framePreview} alt="帧预览" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700" />
              </div>
            )}
            <div className="flex gap-2">
              {[5, 10, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setStartTime(0);
                    setEndTime(Math.min(sec, duration));
                  }}
                  className="px-3 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  前{sec}秒
                </button>
              ))}
            </div>
          </div>
        );

      case "filter":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">选择滤镜</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {videoFilters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterId(f.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterId === f.id
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleFilterPreview}
              className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              预览帧
            </button>
            {framePreview && (
              <div className="mt-2">
                <img src={framePreview} alt="滤镜预览" className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700" />
              </div>
            )}
          </div>
        );

      case "audio":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">输出格式</label>
              <div className="flex gap-2">
                {audioFormats.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAudioFormat(f.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      audioFormat === f.id
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
            {audioFormat !== "wav" && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">音频码率</label>
                <select
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="128k">128 kbps</option>
                  <option value="192k">192 kbps</option>
                  <option value="256k">256 kbps</option>
                  <option value="320k">320 kbps</option>
                </select>
              </div>
            )}
          </div>
        );

      case "gif":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                开始时间: {formatDuration(startTime)}
              </label>
              <input
                type="range"
                min="0"
                max={Math.max(duration, 0.1)}
                step="0.1"
                value={Math.min(startTime, duration)}
                onChange={(e) => setStartTime(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">时长(秒)</label>
                <input
                  type="number"
                  value={gifDuration}
                  onChange={(e) => setGifDuration(Math.max(1, Math.min(10, Number(e.target.value))))}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">帧率</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="5">5 fps</option>
                  <option value="10">10 fps</option>
                  <option value="15">15 fps</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">宽度</label>
                <select
                  value={gifWidth}
                  onChange={(e) => setGifWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  <option value={320}>320px</option>
                  <option value={480}>480px</option>
                  <option value={640}>640px</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderProcessButton = () => {
    let onClick: () => void = () => {};
    let label = "开始处理";
    switch (activeTab) {
      case "convert": onClick = handleConvert; label = "开始转换"; break;
      case "compress": onClick = handleCompress; label = "开始压缩"; break;
      case "trim": onClick = handleTrim; label = "开始剪辑"; break;
      case "filter": onClick = handleFilter; label = "应用滤镜"; break;
      case "audio": onClick = handleAudio; label = "提取音频"; break;
      case "gif": onClick = handleGif; label = "生成GIF"; break;
    }

    return (
      <button
        onClick={onClick}
        disabled={!file || processing || !ffmpegLoaded}
        className="w-full py-3 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            处理中 {progress}%
          </span>
        ) : !ffmpegLoaded ? (
          "点击加载 FFmpeg 引擎"
        ) : (
          label
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError("");
                setSuccess("");
              }}
              className={`p-3 rounded-xl text-left transition-all ${
                activeTab === tab.id
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <div className="text-lg mb-1">{tab.icon}</div>
              <div className="text-xs font-medium">{tab.name}</div>
            </button>
          ))}
        </div>
      </div>

      {!file ? (
        renderUploadArea()
      ) : (
        <div>
          {renderFileInfo()}
          {renderPreview()}
          {renderTabContent()}

          {!ffmpegLoaded && (
            <button
              onClick={loadFfmpeg}
              disabled={processing}
              className="w-full py-3 text-sm font-medium text-white bg-green-600 dark:bg-green-400 dark:text-zinc-900 rounded-xl hover:bg-green-700 dark:hover:bg-green-500 disabled:opacity-50 transition-colors mb-3"
            >
              加载 FFmpeg 引擎（首次约30MB）
            </button>
          )}

          {processing && progress > 0 && (
            <div className="mb-3">
              <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1 text-center">{progress}%</p>
            </div>
          )}

          {error && (
            <div className="p-3 mb-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 mb-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm">
              {success}
            </div>
          )}

          {renderProcessButton()}

          <button
            onClick={() => {
              setFile(null);
              setVideoUrl("");
              setDuration(0);
              setFramePreview("");
              setError("");
              setSuccess("");
            }}
            className="w-full mt-2 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            选择其他视频
          </button>
        </div>
      )}

      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          所有视频处理均在本地浏览器完成，不会上传到任何服务器。首次使用需下载 FFmpeg 引擎（约30MB）。
        </p>
      </div>
    </div>
  );
}
