"use client";
import { Essay } from "@/types/essay";
import React from "react";

export default function MetaFooter({ meta }: { meta: NonNullable<Essay["grading"]>["meta"] }) {
  return (
    <div className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-600 flex justify-between rounded-b-2xl">
      <p>Word count: {meta.wordCount}</p>
      <p>Grammar errors: {meta.grammarErrorCount}</p>
      <p>Spelling errors: {meta.spellingErrorCount}</p>
    </div>
  );
}
