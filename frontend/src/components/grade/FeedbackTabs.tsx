"use client";
import React, { useState } from "react";
import { Essay } from "./types";

export default function FeedbackTabs({ grading }: { grading: NonNullable<Essay["grading"]> }) {
  const [activeTab, setActiveTab] = useState<"vocab" | "sentence" | "structure">("vocab");

  return (
    <div className="bg-white rounded-lg shadow p-4 text-sm">
      {/* Tabs Header */}
      <div className="flex flex-wrap border-b mb-3 gap-2">
        <button
          onClick={() => setActiveTab("vocab")}
          className={`px-3 py-1 font-medium ${
            activeTab === "vocab"
              ? "border-b-2 border-teal-600 text-teal-700"
              : "text-gray-500"
          }`}
        >
          📖 Vocabulary ({grading.vocabulary?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("sentence")}
          className={`px-3 py-1 font-medium ${
            activeTab === "sentence"
              ? "border-b-2 border-teal-600 text-teal-700"
              : "text-gray-500"
          }`}
        >
          💡 Sentence Tips ({grading.sentenceTips?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("structure")}
          className={`px-3 py-1 font-medium ${
            activeTab === "structure"
              ? "border-b-2 border-teal-600 text-teal-700"
              : "text-gray-500"
          }`}
        >
          🏗 Structure Tips
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "vocab" && (
        <ul className="list-disc pl-5 space-y-1">
          {grading.vocabulary?.map((v, i) => (
            <li key={i}>
              <span className="text-red-500">{v.original}</span> →{" "}
              <span className="text-green-600">{v.alternative}</span>
            </li>
          ))}
        </ul>
      )}
      {activeTab === "sentence" && (
        <ul className="list-disc pl-5 space-y-1">
          {grading.sentenceTips?.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      )}
      {activeTab === "structure" && (
        <p className="text-gray-700">{grading.structureTips}</p>
      )}
    </div>
  );
}
