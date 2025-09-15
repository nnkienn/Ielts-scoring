"use client";
import React from "react";
import { Essay } from "./EssayResult";

export default function ScoreDetails({ grading }: { grading: NonNullable<Essay["grading"]> }) {
  return (
    <div className="flex flex-col justify-center flex-1 space-y-3">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-medium text-gray-700">
        <p>🎯 Task Response: {grading.taskResponse}</p>
        <p>🔗 Cohesion: {grading.coherenceCohesion}</p>
        <p>✍️ Lexical: {grading.lexicalResource}</p>
        <p>📝 Grammar: {grading.grammaticalRange}</p>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{grading.feedback}</p>
    </div>
  );
}
