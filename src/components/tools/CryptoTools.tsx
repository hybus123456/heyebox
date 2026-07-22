"use client";

import { useState } from "react";

type Method = "base64" | "url" | "morse" | "caesar" | "rot13" | "vigenere" | "binary" | "hex" | "reverse";

const methods: { id: Method; name: string; desc: string }[] = [
  { id: "base64", name: "Base64", desc: "Base64编解码" },
  { id: "url", name: "URL编码", desc: "URL编解码" },
  { id: "morse", name: "摩斯密码", desc: "摩斯密码编解码" },
  { id: "caesar", name: "凯撒密码", desc: "凯撒密码移位" },
  { id: "rot13", name: "ROT13", desc: "ROT13字母旋转" },
  { id: "vigenere", name: "维吉尼亚", desc: "维吉尼亚密码" },
  { id: "binary", name: "二进制", desc: "文本转二进制" },
  { id: "hex", name: "十六进制", desc: "文本转十六进制" },
  { id: "reverse", name: "反转", desc: "文本反转" },
];

const morseCode: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.",
  "=": "-...-", "+": ".-.-.", "_": "..--.-", '"': ".-..-.", "'": ".----.",
  "@": ".--.-.",
};

const morseReverse: Record<string, string> = {};
Object.entries(morseCode).forEach(([k, v]) => { morseReverse[v] = k; });

function caesarCipher(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char.charCodeAt(0) < 91 ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
  });
}

function vigenereCipher(text: string, key: string, encrypt: boolean): string {
  if (!key) return text;
  let result = "";
  let keyIndex = 0;
  const keyUpper = key.toUpperCase();

  for (const char of text) {
    if (/[a-zA-Z]/.test(char)) {
      const base = char.charCodeAt(0) < 91 ? 65 : 97;
      const keyShift = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65;
      const shift = encrypt ? keyShift : -keyShift;
      result += String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
      keyIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

function textToBinary(text: string): string {
  return text.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}

function binaryToText(binary: string): string {
  return binary.split(" ").filter(b => b.length === 8).map(b => String.fromCharCode(parseInt(b, 2))).join("");
}

function textToHex(text: string): string {
  return text.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase()).join(" ");
}

function hexToText(hex: string): string {
  return hex.split(" ").filter(h => h.length === 2).map(h => String.fromCharCode(parseInt(h, 16))).join("");
}

export function CryptoTools() {
  const [method, setMethod] = useState<Method>("base64");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isEncrypt, setIsEncrypt] = useState(true);
  const [caesarShift, setCaesarShift] = useState(3);
  const [vigenereKey, setVigenereKey] = useState("KEY");

  const process = () => {
    try {
      switch (method) {
        case "base64":
          setOutput(isEncrypt ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input))));
          break;
        case "url":
          setOutput(isEncrypt ? encodeURIComponent(input) : decodeURIComponent(input));
          break;
        case "morse":
          if (isEncrypt) {
            setOutput(input.toUpperCase().split("").map(c => morseCode[c] || c).join(" "));
          } else {
            setOutput(input.split(" ").map(c => morseReverse[c] || c).join(""));
          }
          break;
        case "caesar":
          setOutput(caesarCipher(input, isEncrypt ? caesarShift : -caesarShift));
          break;
        case "rot13":
          setOutput(caesarCipher(input, 13));
          break;
        case "vigenere":
          setOutput(vigenereCipher(input, vigenereKey, isEncrypt));
          break;
        case "binary":
          setOutput(isEncrypt ? textToBinary(input) : binaryToText(input));
          break;
        case "hex":
          setOutput(isEncrypt ? textToHex(input) : hexToText(input));
          break;
        case "reverse":
          setOutput(input.split("").reverse().join(""));
          break;
      }
    } catch {
      setOutput("错误：输入格式不正确");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  const currentMethod = methods.find(m => m.id === method);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">加密方式</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                method === m.id
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {method !== "rot13" && method !== "reverse" && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsEncrypt(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEncrypt
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            }`}
          >
            加密
          </button>
          <button
            onClick={() => setIsEncrypt(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !isEncrypt
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            }`}
          >
            解密
          </button>
        </div>
      )}

      {method === "caesar" && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">移位数：{caesarShift}</label>
          <input
            type="range"
            min="1"
            max="25"
            value={caesarShift}
            onChange={(e) => setCaesarShift(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {method === "vigenere" && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">密钥</label>
          <input
            type="text"
            value={vigenereKey}
            onChange={(e) => setVigenereKey(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())}
            placeholder="输入密钥（纯字母）"
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">输入</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            placeholder={`输入要${isEncrypt ? "加密" : "解密"}的内容`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">输出</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-40 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm resize-none"
            placeholder="结果将显示在这里"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={process}
          className="px-6 py-2.5 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          {isEncrypt ? "加密" : "解密"}
        </button>
        {output && (
          <button
            onClick={copy}
            className="px-6 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            复制结果
          </button>
        )}
      </div>

      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {currentMethod?.desc} · 支持：Base64、URL、摩斯密码、凯撒密码、ROT13、维吉尼亚密码、二进制、十六进制、反转
        </p>
      </div>
    </div>
  );
}
