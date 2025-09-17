"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { RootState } from "@/store/store";
import { fetchEssay, socketEssayUpdate, retryEssay } from "@/store/Slices/essaySlice";
import { initSocket } from "@/lib/socket";

import PrivateNavbar from "@/components/layout/PrivateNavbar";
import Footer from "@/components/layout/Footer";
import EssayResult from "@/components/grade/EssayResult";
import EssayContent from "@/components/grade/EssayContent"; // 👈 ADD

import { RotateCcw } from "lucide-react";

export default function GradeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const dispatch = useAppDispatch();
  const { currentEssay, loading, error } = useSelector((s: RootState) => s.essays);

  // 1) Fetch essay by id
  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    dispatch(fetchEssay(id));
  }, [id, dispatch]);

  // 2) Join Socket.IO room + subscribe realtime
  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    const socket = initSocket();
    const channel = `essay_update_${id}`;
    const handler = (data: any) => { dispatch(socketEssayUpdate(data)); };

    socket.emit("joinEssay", { essayId: id });
    socket.off(channel, handler);
    socket.on(channel, handler);

    return () => { socket.off(channel, handler); }; // ✅ cleanup void
  }, [id, dispatch]);

  const canRetry =
    currentEssay &&
    (currentEssay.status === "failed" || currentEssay.status === "done");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PrivateNavbar />

      <div className="flex flex-col min-h-screen bg-gray-50 mt-16">
        {/* Header */}
        <section className="flex items-center justify-between gap-4 bg-[#edf6f6] px-6 py-6">
          <div className="text-teal-700">
            <h1 className="text-2xl md:text-3xl font-bold">Essay #{id}</h1>
            <p className="text-sm">Realtime grading & feedback</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/grade-list"
              className="h-9 px-3 inline-flex items-center justify-center rounded-lg border text-sm font-medium hover:bg-white/60"
            >
              ← Back to list
            </Link>
            {canRetry && (
              <button
                onClick={() => dispatch(retryEssay(id))}
                className="h-9 px-3 inline-flex items-center gap-1 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600"
              >
                <RotateCcw size={16} /> Retry
              </button>
            )}
          </div>
        </section>

        {/* Content */}
        <div className="max-w-5xl mx-auto w-full p-6">
          <div className="bg-white rounded-2xl shadow p-4">
            {(!id || Number.isNaN(id)) && <div className="text-rose-600">Invalid essay id.</div>}
            {error && !currentEssay && <div className="text-rose-600">Error: {error}</div>}
            {loading && !currentEssay && <div className="text-gray-500">Loading…</div>}

            {/* 👉 Hiển thị bài text + prompt */}
            {currentEssay && (
              <EssayContent
                prompt={currentEssay.prompt}
                text={currentEssay.text}
                meta={currentEssay.grading?.meta}
              />
            )}

            {/* 👉 Kết quả chấm điểm */}
            {currentEssay && <EssayResult essay={currentEssay} />}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
