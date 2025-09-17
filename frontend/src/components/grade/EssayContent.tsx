"use client";
import React, { useMemo, useState } from "react";
import { FileText, Clipboard, ClipboardCheck } from "lucide-react";

type EssayContentProps = {
  prompt?: { question?: string };
  text?: string;
  meta?: {
    wordCount?: number;
    grammarErrorCount?: number;
    spellingErrorCount?: number;
  };
};

export default function EssayContent({ prompt, text, meta }: EssayContentProps) {
  const [copied, setCopied] = useState(false);

  const wordCount = useMemo(() => {
    if (meta?.wordCount) return meta.wordCount;
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [meta?.wordCount, text]);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  if (!text && !prompt?.question) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 shadow-sm ring-1 ring-slate-100/60 p-5 md:p-6 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 grid place-items-center rounded-xl bg-teal-50 text-teal-700 ring-8 ring-teal-50">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            {prompt?.question && (
              <p className="text-[13px] px-2 text-slate-600">
                <span className="font-medium text-slate-700">Prompt:</span>{" "}
                {prompt.question}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {wordCount} words
          </span>
          {typeof meta?.grammarErrorCount === "number" && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
              Grammar {meta.grammarErrorCount}
            </span>
          )}
          {typeof meta?.spellingErrorCount === "number" && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
              Spelling {meta.spellingErrorCount}
            </span>
          )}
          <button
            onClick={handleCopy}
            disabled={!text}
            className="h-8 px-2 inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            title="Copy essay text"
          >
            {copied ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="mt-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 md:p-5 max-h-[60vh] overflow-y-auto"
           style={{ scrollbarGutter: "stable" }}>
        <article className="whitespace-pre-wrap break-words text-slate-800 leading-7 md:leading-8 text-[15px] md:text-base tracking-[0.005em]">
          {text || "—"}
        </article>
      </div>
    </section>
  );
}
