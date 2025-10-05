"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PrivateNavbar from "@/components/layout/PrivateNavbar";
import Footer from "@/components/layout/Footer";
import ConfirmModal from "@/components/layout/ConfirmModal";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { useAppSelector } from "@/hook/useAppSelector";
import { RootState } from "@/store/store";
import {
  listEssays,
  deleteEssay,
  retryEssay,
  socketEssayUpdate,
} from "@/store/Slices/essaySlice";
import { initSocket } from "@/lib/socket";
import { Eye, RotateCcw, Trash2 } from "lucide-react";

type Essay = {
  id: number;
  status: "pending" | "done" | "failed";
  prompt?: { question?: string };
  grading?: { overallBand?: number };
  createdAt?: string;
};

export default function EssayListPage() {
  const dispatch = useAppDispatch();
  const { essays, loading } = useAppSelector((s: RootState) => s.essays);
  const accessToken = useAppSelector((s: RootState) => s.auth.accessToken);

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    dispatch(listEssays());
  }, [dispatch]);

  // --- Realtime: join tất cả essay đang pending ---
  const pendingIds = useMemo(
    () =>
      Array.from(
        new Set(
          (essays as Essay[])
            ?.filter((e) => e.status === "pending")
            .map((e) => e.id)
        )
      ),
    [essays]
  );

  useEffect(() => {
    if (pendingIds.length === 0) return;

    // truyền token (null-safe) để khỏi warning TS và để backend auth socket (nếu cần)
    const socket = initSocket(accessToken ?? undefined);
    if (!socket) return; // guard khi (lý thuyết) chạy SSR

    const offs: Array<() => void> = [];

    pendingIds.forEach((id) => {
      const channel = `essay_update_${id}`;

      // join room
      socket.emit("joinEssay", { essayId: id });

      // handler phải là 1 tham chiếu ổn định để off chính xác
      const handler = (data: any) => dispatch(socketEssayUpdate(data));

      // gỡ handler cũ nếu có (tránh duplicate)
      socket.off(channel, handler);
      socket.on(channel, handler);

      // cleanup cho từng channel
      offs.push(() => socket.off(channel, handler));
    });

    return () => offs.forEach((fn) => fn());
  }, [pendingIds, dispatch, accessToken]);

  const handleDelete = (id: number) => setDeleteTarget(id);

  const confirmDelete = () => {
    if (deleteTarget) {
      dispatch(deleteEssay(deleteTarget));
      setDeleteTarget(null);
    }
  };

  const formatDate = (d?: string) => (d ? new Date(d).toLocaleString() : "—");

  const StatusChip = ({ status }: { status: Essay["status"] }) => {
    const map: Record<Essay["status"], string> = {
      pending: "bg-amber-50 text-amber-700 ring-amber-200",
      done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      failed: "bg-rose-50 text-rose-700 ring-rose-200",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${map[status]}`}
      >
        {status}
      </span>
    );
  };

  const list = (essays as Essay[]) ?? [];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PrivateNavbar />

      <div className="flex flex-col min-h-screen bg-gray-50 mt-16">
        {/* Header */}
        <section className="grid place-items-center text-center bg-[#edf6f6] px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-teal-700">
            📚 My Essays
          </h1>
          <p className="text-sm text-teal-700">
            Track grading status in real time
          </p>
        </section>

        {/* Content */}
        <div className="flex-1 p-6">
          {loading ? (
            <p className="text-gray-500">⏳ Loading essays...</p>
          ) : list.length === 0 ? (
            <p className="text-gray-500 italic">No essays submitted yet.</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="bg-teal-600 text-white">
                    <tr>
                      <th className="px-4 py-3">Prompt</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Band</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((e) => (
                      <tr key={e.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 max-w-[520px]">
                          <div className="line-clamp-2">
                            {e.prompt?.question || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3">{formatDate(e.createdAt)}</td>
                        <td className="px-4 py-3 capitalize">
                          <StatusChip status={e.status} />
                        </td>
                        <td className="px-4 py-3">
                          {e.grading?.overallBand ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/grade/${e.id}`}
                              className="min-w-[80px] h-8 px-3 inline-flex items-center justify-center gap-1 
                                         text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <Eye size={14} /> View
                            </Link>

                            {e.status !== "pending" && (
                              <button
                                onClick={() => dispatch(retryEssay(e.id))}
                                className="min-w-[80px] h-8 px-3 inline-flex items-center justify-center gap-1 
                                           text-xs font-medium rounded text-white bg-amber-500 hover:bg-amber-600"
                              >
                                <RotateCcw size={14} /> Retry
                              </button>
                            )}

                            {e.status === "pending" && (
                              <button
                                onClick={() => handleDelete(e.id)}
                                className="min-w-[80px] h-8 px-3 inline-flex items-center justify-center gap-1 
                                           text-xs font-medium rounded text-white bg-rose-500 hover:bg-rose-600"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {list.map((e) => (
                  <div key={e.id} className="bg-white rounded-xl shadow p-4 space-y-2">
                    <p className="text-sm font-medium text-gray-800">
                      <span className="font-semibold">Prompt:</span>{" "}
                      <span className="text-gray-700">
                        {e.prompt?.question || "—"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Created:</span>{" "}
                      {formatDate(e.createdAt)}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-semibold">Status:</span>{" "}
                      <StatusChip status={e.status} />
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Band:</span>{" "}
                      {e.grading?.overallBand ?? "—"}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/grade/${e.id}`}
                        className="flex-1 h-9 inline-flex items-center justify-center gap-1 
                                   text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Eye size={16} /> View
                      </Link>

                      {e.status !== "pending" && (
                        <button
                          onClick={() => dispatch(retryEssay(e.id))}
                          className="flex-1 h-9 inline-flex items-center justify-center gap-1 
                                     text-sm font-medium rounded text-white bg-amber-500 hover:bg-amber-600"
                        >
                          <RotateCcw size={16} /> Retry
                        </button>
                      )}

                      {e.status === "pending" && (
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="flex-1 h-9 inline-flex items-center justify-center gap-1 
                                     text-sm font-medium rounded text-white bg-rose-500 hover:bg-rose-600"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>

      {/* Confirm modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Essay"
        message="Are you sure you want to delete this pending essay?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
