"use client";
import React from "react";
import ScoreCircle from "./ScoreCircle";
import ScoreDetails from "./ScoreDetails";
import FeedbackTabs from "./FeedbackTabs";
import MetaFooter from "./MetaFooter";

interface Essay {
  status: string;
  prompt?: { question: string };
  grading?: {
    overallBand: number;
    taskResponse: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRange: number;
    feedback: string;
    annotations: any[];
    vocabulary: { original: string; alternative: string }[];
    sentenceTips: string[];
    structureTips: string;
    meta: {
      wordCount: number;
      grammarErrorCount: number;
      spellingErrorCount: number;
    };
  };
}

export default function EssayResult({ essay }: { essay?: Essay | null }) {
  if (!essay) {
    return (
      <div className="text-gray-400 italic">
        ✍️ Submit an essay to see results here.
      </div>
    );
  }

  // ✅ normalize status về lowercase
  if (essay.status.toLowerCase() !== "done" || !essay.grading) {
    return (
      <div className="text-gray-500">
        ⏳ Your essay is being graded... Please wait.
      </div>
    );
  }

  const g = essay.grading;

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6 flex-1">
        {/* Scores */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row items-center gap-6">
          <ScoreCircle overallBand={g.overallBand} />
          <ScoreDetails grading={g} />
        </div>

        {/* Feedback Tabs */}
        <FeedbackTabs grading={g} />
      </div>

      {/* Footer */}
      <MetaFooter meta={g.meta} />
    </div>
  );
}
