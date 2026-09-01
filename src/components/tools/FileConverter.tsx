"use client";

import { useState, useRef } from "react";

type ConversionType = 
  | "text-to-pdf"
  | "markdown-to-pdf"
  | "image-to-pdf"
  | "word-to-pdf"
  | "excel-to-csv"
  | "excel-to-pdf"
  | "json-to-pdf"
  | "text-to-word";

interface ConversionOption {
  id: ConversionType;
  name: string;
  desc: string;
  accept: string;
  icon: string;
}

const conversionOptions: ConversionOption[] = [
  { id: "text-to-pdf", name: "文本 → PDF", desc: "将文本内容转为PDF文件", accept: ".txt", icon: "📄" },
  { id: "markdown-to-pdf", name: "Markdown → PDF", desc: "将Markdown转为PDF文件", accept: ".md,.markdown", icon: "📝" },
  { id: "image-to-pdf", name: "图片 → PDF", desc: "将图片合并为PDF文件", accept: "image/*", icon: "🖼️" },
  { id: "word-to-pdf", name: "Word → PDF", desc: "将Word文档转为PDF", accept: ".docx", icon: "📘" },
  { id: "excel-to-csv", name: "Excel → CSV", desc: "将Excel转为CSV格式", accept: ".xlsx,.xls", icon: "📊" },
  { id: "excel-to-pdf", name: "Excel → PDF", desc: "将Excel转为PDF表格", accept: ".xlsx,.xls", icon: "📊" },
  { id: "json-to-pdf", name: "JSON → PDF", desc: "将JSON数据转为PDF报表", accept: ".json", icon: "📋" },
  { id: "text-to-word", name: "文本 → Word", desc: "将文本转为Word文档", accept: ".txt", icon: "📘" },
];

export function FileConverter() {
  const [selectedType, setSelectedType] = useState<ConversionType>("text-to-pdf");
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentOption = conversionOptions.find(o => o.id === selectedType)!;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError("");
      setSuccess("");
    }
  };

  const convert = async () => {
    if (!file) {
      setError("请先选择文件");
      return;
    }

    setConverting(true);
    setError("");
    setSuccess("");

    try {
      switch (selectedType) {
        case "text-to-pdf":
          await textToPdf(file);
          break;
        case "markdown-to-pdf":
          await markdownToPdf(file);
          break;
        case "image-to-pdf":
          await imageToPdf(file);
          break;
        case "word-to-pdf":
          await wordToPdf(file);
          break;
        case "excel-to-csv":
          await excelToCsv(file);
          break;
        case "excel-to-pdf":
          await excelToPdf(file);
          break;
        case "json-to-pdf":
          await jsonToPdf(file);
          break;
        case "text-to-word":
          await textToWord(file);
          break;
      }
      setSuccess("转换完成！");
    } catch (err) {
      setError("转换失败：" + (err as Error).message);
    } finally {
      setConverting(false);
    }
  };

  const textToPdf = async (file: File) => {
    const { jsPDF } = await import("jspdf");
    const text = await file.text();
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 10);
    doc.save(file.name.replace(/\.txt$/, ".pdf"));
  };

  const markdownToPdf = async (file: File) => {
    const { jsPDF } = await import("jspdf");
    const { marked } = await import("marked");
    const md = await file.text();
    const html = marked(md);
    const text = typeof html === "string" ? html : await html;
    const cleanText = text.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(cleanText, 180);
    doc.text(lines, 10, 10);
    doc.save(file.name.replace(/\.md$/, ".pdf"));
  };

  const imageToPdf = async (file: File) => {
    const { jsPDF } = await import("jspdf");
    const img = await loadImage(file);
    const doc = new jsPDF({
      orientation: img.width > img.height ? "landscape" : "portrait",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
    const width = img.width * ratio;
    const height = img.height * ratio;
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;
    doc.addImage(img.src, "JPEG", x, y, width, height);
    doc.save(file.name.replace(/\.[^.]+$/, ".pdf"));
  };

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const wordToPdf = async (file: File) => {
    const mammoth = await import("mammoth");
    const { jsPDF } = await import("jspdf");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(result.value, 180);
    doc.text(lines, 10, 10);
    doc.save(file.name.replace(/\.docx$/, ".pdf"));
  };

  const excelToCsv = async (file: File) => {
    const XLSX = await import("xlsx");
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(firstSheet);
    downloadFile(csv, file.name.replace(/\.xlsx?$/, ".csv"), "text/csv");
  };

  const excelToPdf = async (file: File) => {
    const XLSX = await import("xlsx");
    const { jsPDF } = await import("jspdf");
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][];
    
    const doc = new jsPDF();
    let y = 10;
    
    data.forEach((row: string[]) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      const text = row.map(cell => String(cell || "")).join(" | ");
      doc.text(text, 10, y);
      y += 7;
    });
    
    doc.save(file.name.replace(/\.xlsx?$/, ".pdf"));
  };

  const jsonToPdf = async (file: File) => {
    const { jsPDF } = await import("jspdf");
    const text = await file.text();
    const data = JSON.parse(text);
    const formatted = JSON.stringify(data, null, 2);
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(formatted, 180);
    doc.text(lines, 10, 10);
    doc.save(file.name.replace(/\.json$/, ".pdf"));
  };

  const textToWord = async (file: File) => {
    const { Document, Packer, Paragraph, TextRun } = await import("docx");
    const text = await file.text();
    const lines = text.split("\n");
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: lines.map(line => 
          new Paragraph({
            children: [new TextRun(line)],
          })
        ),
      }],
    });
    
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.txt$/, ".docx");
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          选择转换类型
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {conversionOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSelectedType(option.id);
                setFile(null);
                setError("");
                setSuccess("");
              }}
              className={`p-3 rounded-xl text-left transition-all ${
                selectedType === option.id
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <div className="text-lg mb-1">{option.icon}</div>
              <div className="text-xs font-medium">{option.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            {currentOption.icon} {currentOption.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {currentOption.desc}
          </p>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl p-8 text-center cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors mb-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={currentOption.accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <svg className="w-10 h-10 mx-auto mb-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {file ? (
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {file.name}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                点击选择文件
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                支持 {currentOption.accept} 格式
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm">
            {success}
          </div>
        )}

        <button
          onClick={convert}
          disabled={!file || converting}
          className="w-full py-3 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {converting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              转换中...
            </span>
          ) : (
            "开始转换"
          )}
        </button>
      </div>

      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          所有转换均在本地完成，文件不会上传到服务器
        </p>
      </div>
    </div>
  );
}
