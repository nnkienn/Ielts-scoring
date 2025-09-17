export interface Essay {
  id: number;
  text: string;
  status: "pending" | "done" | "failed";
  reused?: boolean;
  prompt?: {
    id: number;
    question: string;
    taskType: string;
  };
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
