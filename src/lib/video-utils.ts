export interface FilterOption {
  id: string;
  name: string;
  filter: string | null;
}

export const videoFilters: FilterOption[] = [
  { id: "none", name: "原图", filter: null },
  { id: "bw", name: "黑白", filter: "hue=s=0" },
  { id: "sepia", name: "复古", filter: "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131" },
  { id: "warm", name: "暖色", filter: "colorbalance=rs=.1:gs=0:bs=-.1" },
  { id: "cool", name: "冷色", filter: "colorbalance=rs=-.1:gs=0:bs=.1" },
  { id: "contrast", name: "高对比", filter: "eq=contrast=1.5" },
  { id: "bright", name: "变亮", filter: "eq=brightness=0.1" },
  { id: "dark", name: "变暗", filter: "eq=brightness=-0.1" },
  { id: "blur", name: "模糊", filter: "boxblur=5:2" },
  { id: "sharpen", name: "锐化", filter: "unsharp=5:5:0.8" },
];

export const videoFormats = [
  { id: "mp4", name: "MP4", ext: "mp4", codec: "libx264" },
  { id: "webm", name: "WebM", ext: "webm", codec: "libvpx" },
  { id: "avi", name: "AVI", ext: "avi", codec: "libx264" },
  { id: "mkv", name: "MKV", ext: "mkv", codec: "libx264" },
  { id: "mov", name: "MOV", ext: "mov", codec: "libx264" },
];

export const audioFormats = [
  { id: "mp3", name: "MP3", ext: "mp3", codec: "libmp3lame" },
  { id: "wav", name: "WAV", ext: "wav", codec: "pcm_s16le" },
  { id: "aac", name: "AAC", ext: "aac", codec: "aac" },
];

export const resolutions = [
  { id: "original", name: "原始分辨率" },
  { id: "1080", name: "1080p" },
  { id: "720", name: "720p" },
  { id: "480", name: "480p" },
  { id: "360", name: "360p" },
];

export function buildConvertCommand(
  format: { codec: string; ext: string },
  resolution: string,
  crf: string
): string[] {
  const args = ["-i", "input.mp4"];
  if (resolution !== "original") {
    args.push("-vf", `scale=-2:${resolution}`);
  }
  if (format.ext === "webm") {
    args.push("-c:v", "libvpx-vp9", "-crf", crf, "-b:v", "0");
  } else {
    args.push("-c:v", format.codec, "-crf", crf);
  }
  args.push("-preset", "medium", "-y", `output.${format.ext}`);
  return args;
}

export function buildFilterCommand(filter: string, format: { codec: string; ext: string }): string[] {
  return ["-i", "input.mp4", "-vf", filter, "-c:v", format.codec, "-crf", "23", "-preset", "medium", "-y", `output.${format.ext}`];
}

export function buildTrimCommand(
  start: number,
  end: number,
  format: { codec: string; ext: string }
): string[] {
  const duration = end - start;
  return [
    "-i", "input.mp4",
    "-ss", start.toFixed(2),
    "-t", duration.toFixed(2),
    "-c:v", format.codec,
    "-c:a", "aac",
    "-y", `output.${format.ext}`,
  ];
}

export function buildAudioCommand(format: { codec: string; ext: string }, bitrate: string): string[] {
  const args = ["-i", "input.mp4", "-vn"];
  if (format.ext === "mp3") {
    args.push("-c:a", "libmp3lame", "-b:a", bitrate);
  } else if (format.ext === "wav") {
    args.push("-c:a", "pcm_s16le");
  } else {
    args.push("-c:a", "aac", "-b:a", bitrate);
  }
  args.push("-y", `output.${format.ext}`);
  return args;
}

export function buildGifCommand(start: number, duration: number, fps: string, width: number): string[] {
  const args = [
    "-i", "input.mp4",
    "-ss", start.toFixed(2),
    "-t", duration.toFixed(2),
    "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos`,
    "-y", "output.gif",
  ];
  return args;
}

export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve(video.duration || 0);
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => resolve(0);
    video.src = URL.createObjectURL(file);
  });
}

export async function extractFrame(
  file: File,
  time: number
): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      video.currentTime = Math.max(0, Math.min(time, video.duration - 0.1));
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      } else {
        resolve("");
      }
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => resolve("");
    video.src = URL.createObjectURL(file);
  });
}

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds <= 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}
