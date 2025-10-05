// src/app/(protected)/grade/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { submitEssay, socketEssayUpdate } from "@/store/Slices/essaySlice";

import EditorUI from "@/components/editor/Editor";
import Footer from "@/components/layout/Footer";
import PrivateNavbar from "@/components/layout/PrivateNavbar";
import EssayResult from "@/components/grade/EssayResult";
import { initSocket } from "@/lib/socket";

export default function GradePage() {
  const [text, setText] = useState("");
  const [promptId, setPromptId] = useState<number | "">("");
  const [question, setQuestion] = useState("");
  const [taskType, setTaskType] = useState("Task2");

  const dispatch = useAppDispatch();
  const { currentEssay, loading } = useSelector((s: RootState) => s.essays);
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);

  // Demo prompts — tùy bạn thay bằng data thực tế
  const prompts = [
    { id: 1, question: "Some people think international trade is beneficial." },
    { id: 2, question: "Technology has changed the way we communicate." },
    { id: 3, question: "Many argue education should be free for all." },
  ];

  const handleSubmit = async () => {
    const payload: any = { text };
    if (promptId) {
      payload.promptId = promptId;
    } else {
      payload.question = question;
      payload.taskType = taskType;
    }

    try {
      const res = await dispatch(submitEssay(payload)).unwrap();
      const id = res?.id ?? res?.essayId;
      if (!id) return;

      // Khởi tạo socket (client only) và JOIN room
      const sock = initSocket(accessToken);
      if (!sock) return;

      const channel = `essay_update_${id}`;
      sock.emit("joinEssay", { essayId: id });
      sock.off(channel); // tránh duplicate listener
      sock.on(channel, (data) => dispatch(socketEssayUpdate(data)));
    } catch (err) {
      console.error("❌ Submit essay error:", err);
    }
  };

  // Re-subscribe khi refresh hoặc khi currentEssay đổi
  useEffect(() => {
    const id = currentEssay?.id ?? currentEssay?.essayId;
    if (!id) return;

    const sock = initSocket(accessToken);
    if (!sock) return;

    const channel = `essay_update_${id}`;
    sock.emit("joinEssay", { essayId: id });
    sock.off(channel);
    sock.on(channel, (data) => dispatch(socketEssayUpdate(data)));

    return () => {
      sock.off(channel);
    };
  }, [dispatch, currentEssay?.id, currentEssay?.essayId, accessToken]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PrivateNavbar />

      <div className="flex flex-col min-h-screen bg-gray-50 mt-16">
        {/* Header */}
        <section className="grid place-items-center text-center bg-[#edf6f6] px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-semibold rounded bg-teal-700 text-white">
              Scoring IELTS
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-teal-700">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 items-start">
          <div className="flex flex-col gap-4 h-full">
            {/* Choose Prompt */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                ✍️ Choose Prompt
              </h2>

              {/* Existing prompt */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Select existing prompt
                </label>
                <select
                  className="w-full border-gray-300 text-gray-800 font-medium 
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-500 
                             rounded-lg p-2.5 shadow-sm transition cursor-pointer"
                  value={promptId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPromptId(val ? Number(val) : "");
                    setQuestion("");
                  }}
                >
                  <option value="" className="text-gray-500">
                    -- Select prompt --
                  </option>
                  {prompts.map((p) => (
                    <option key={p.id} value={p.id} className="hover:bg-teal-100">
                      {p.question}
                    </option>
                  ))}
                </select>
              </div>

              {/* New prompt input */}
              {!promptId && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Or enter a new prompt
                    </label>
                    <input
                      type="text"
                      placeholder="Write your own question..."
                      className="w-full border-gray-300 text-gray-800 font-medium 
                                 placeholder:text-gray-400 
                                 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 
                                 rounded-lg p-2.5 shadow-sm"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Task type
                    </label>
                    <select
                      className="w-full border-gray-300 text-gray-800 font-medium 
                                 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 
                                 rounded-lg p-2.5 shadow-sm cursor-pointer"
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value)}
                    >
                      <option value="Task1">Task 1 (Graphs, Charts)</option>
                      <option value="Task2">Task 2 (Essay, Opinion)</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Editor */}
            <EditorUI onChange={setText} />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg font-semibold shadow-md transition disabled:opacity-60"
              disabled={loading || !text.trim()}
            >
              {loading ? "Submitting..." : "Submit Essay"}
            </button>
          </div>

          {/* Result */}
          <div className="h-full">
            <div className="bg-white rounded-2xl shadow p-4">
              <EssayResult essay={currentEssay} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
