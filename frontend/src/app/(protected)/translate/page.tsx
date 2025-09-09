"use client";
import { useState } from "react";
import EditorUI from "@/components/editor/Editor";
import Footer from "@/components/layout/Footer";
import PrivateNavbar from "@/components/layout/PrivateNavbar";
import LanguageSelector from "@/components/editor/LanguageSelector";
import { useTranslate } from "@/service/useTranslate";

export default function TranslatePage() {
  const [source, setSource] = useState("en");
  const [target, setTarget] = useState("vi");
  const [text, setText] = useState("");

  const { translated, loading, error } = useTranslate(text, source, target);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PrivateNavbar />
      <div className="flex flex-col min-h-screen bg-gray-50 mt-16">
           <section className="grid place-items-center text-center bg-[#edf6f6] px-6 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-semibold rounded bg-teal-700 text-white">
              Scoring IELTS
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-teal-700">
              Free IELTS Writing Checker 2.0
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold border-2 border-teal-700 text-teal-700 rounded">
              FREE
            </span>
          </div>
          <p className="text-sm md:text-base font-medium text-teal-700 mb-4">
            ✨ AI-Powered | Trained on a Large Dataset
          </p>
        </section>
        {/* Language selector bar */}
        <div className="flex justify-center items-center gap-4 p-4 bg-white shadow-sm">
          <LanguageSelector value={source} onChange={setSource} />
          <button
            onClick={() => {
              setSource(target);
              setTarget(source);
            }}
            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <p className="text-black">⇄</p>
            
          </button>
          <LanguageSelector value={target} onChange={setTarget} />
        </div>

        {/* 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left: Input editor */}
          <EditorUI onChange={setText} />

          {/* Right: Output translated */}
          <div className="bg-white rounded-2xl shadow p-6 min-h-[500px]">
            {loading ? (
              <p className="text-gray-500 italic">Translating...</p>
            ) : error ? (
              <p className="text-red-500">⚠️ {error}</p>
            ) : translated ? (
              <p className="text-gray-800 text-base whitespace-pre-wrap">{translated}</p>
            ) : (
              <p className="text-gray-400 text-base">
                Your translation will appear here...
              </p>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
