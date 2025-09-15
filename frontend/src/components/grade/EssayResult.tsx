"use client";
import React from "react";
import ScoreCircle from "./ScoreCircle";
import ScoreDetails from "./ScoreDetails";
import FeedbackTabs from "./FeedbackTabs";
import MetaFooter from "./MetaFooter";


const mockEssay = {
  status: "done",
  prompt: { question: "Some people think international" },
  grading: {
    overallBand: 7,
    taskResponse: 6.5,
    coherenceCohesion: 7,
    lexicalResource: 6.5,
    grammaticalRange: 6,
    feedback: "[MOCK] Grading for Task2. Essay length 30 words.",
    annotations: [],
    vocabulary: [
      { original: "big", alternative: "significant" },
      { original: "good", alternative: "beneficial" },
    ],
    sentenceTips: [
      "Instead of 'This is a big problem', say 'This poses a significant challenge for society.'",
    ],
    structureTips: "Expand the introduction with a clear thesis statement.",
    meta: {
      wordCount: 30,
      grammarErrorCount: 2,
      spellingErrorCount: 1,
    },
  },
};

export default function EssayResult({ essay }: { essay?: Essay }) {
  const currentEssay = essay ?? mockEssay;

  if (!currentEssay) {
    return (
      <div className="text-gray-400 italic">
        Submit an essay to see results here.
      </div>
    );
  }
  if (currentEssay.status !== "done" || !currentEssay.grading) {
    return (
      <div className="text-gray-500">
        ⏳ Your essay is being graded... Please wait.
      </div>
    );
  }

  const g = currentEssay.grading;

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
