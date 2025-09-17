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

  const prompts = [
    { id: 1, question: "Some people think international trade is beneficial." },
    { id: 2, question: "Technology has changed the way we communicate." },
    { id: 3, question: "Many argue education should be free for all." },
  ];

  const handleSubmit = async () => {
    const payload: any = { text };
    if (promptId) payload.promptId = promptId;
    else {
      payload.question = question;
      payload.taskType = taskType;
    }

    console.log("🚀 [FE] Submitting essay:", payload);

    try {
      const res = await dispatch(submitEssay(payload)).unwrap();
      console.log("✅ [FE] Submit response:", res);

      const id = res.id ?? res.essayId;
      if (id) {
        const socket = initSocket();
        const channel = `essay_update_${id}`;

        // 👈 join room ngay sau submit
        socket.emit("joinEssay", { essayId: id });

        socket.off(channel);
        socket.on(channel, (data) => {
          console.log("📥 [FE] Essay update received:", data);
          dispatch(socketEssayUpdate(data));
        });
      }
    } catch (err) {
      console.error("❌ [FE] Submit essay error:", err);
    }
  };

  // 👂 Khi reload trang mà đã có currentEssay -> re-subscribe + join
  useEffect(() => {
    const socket = initSocket();
    const id = currentEssay?.id ?? currentEssay?.essayId;

    if (id) {
      const channel = `essay_update_${id}`;
      console.log("👂 [FE] Re-subscribing after reload:", channel);

      socket.emit("joinEssay", { essayId: id }); // 👈 join lại

      socket.off(channel);
      socket.on(channel, (data) => {
        console.log("📩 [FE] Essay update realtime:", data);
        dispatch(socketEssayUpdate(data));
      });

      return () => {
        console.log("🧹 [FE] Cleanup socket listener:", channel);
        socket.off(channel);
      };
    }
  }, [dispatch, currentEssay?.id, currentEssay?.essayId]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PrivateNavbar />

      <div className="flex flex-col min-h-screen bg-gray-50 mt-16">
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
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-lg font-bold text-teal-700 mb-2">Choose Prompt</h2>

              <select
                className="w-full border p-2 rounded mb-2"
                value={promptId}
                onChange={(e) => {
                  const val = e.target.value;
                  setPromptId(val ? Number(val) : "");
                  setQuestion("");
                }}
              >
                <option value="">-- Select existing prompt --</option>
                {prompts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.question}
                  </option>
                ))}
              </select>

              {!promptId && (
                <>
                  <input
                    type="text"
                    placeholder="Or enter a new prompt..."
                    className="w-full border p-2 rounded mb-2"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <select
                    className="w-full border p-2 rounded"
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                  >
                    <option value="Task1">Task 1</option>
                    <option value="Task2">Task 2</option>
                  </select>
                </>
              )}
            </div>

            <EditorUI onChange={setText} />

            <button
              onClick={handleSubmit}
              className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Essay"}
            </button>
          </div>

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
