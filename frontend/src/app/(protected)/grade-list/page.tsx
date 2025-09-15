"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { listEssays, deleteEssay, retryEssay } from "@/store/Slices/essaySlice";
import PrivateNavbar from "@/components/layout/PrivateNavbar";
import Footer from "@/components/layout/Footer";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { RootState } from "@/store/store";
import ConfirmModal from "@/components/layout/ConfirmModal";

// icons
import { Eye, RotateCcw, Trash2 } from "lucide-react";

export default function EssayListPage() {
  const dispatch = useAppDispatch();
  const { essays, loading } = useSelector((s: RootState) => s.essays);

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    dispatch(listEssays());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      dispatch(deleteEssay(deleteTarget));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PrivateNavbar />
      <div className="flex flex-col min-h-screen bg-gray-50 mt-16">
        {/* Header */}
        <section className="grid place-items-center text-center bg-[#edf6f6] px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-teal-700">
            📚 My Essays
          </h1>
        </section>

        {/* Content */}
        <div className="flex-1 p-6">
          {loading ? (
            <p className="text-gray-500">⏳ Loading essays...</p>
          ) : essays.length === 0 ? (
            <p className="text-gray-500 italic">No essays submitted yet.</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="bg-teal-600 text-white">
                    <tr>
                      <th className="px-4 py-3">Prompt</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Band</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {essays.map((e) => (
                      <tr key={e.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {e.prompt?.question || "—"}
                        </td>
                        <td className="px-4 py-3 capitalize">{e.status}</td>
                        <td className="px-4 py-3">
                          {e.grading?.overallBand ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="min-w-[80px] h-8 px-3 flex items-center justify-center gap-1 
                                         text-xs font-medium rounded text-white bg-blue-500 hover:bg-blue-600"
                            >
                              <Eye size={14} /> View
                            </button>

                            {e.status !== "PENDING" && (
                              <button
                                onClick={() => dispatch(retryEssay(e.id))}
                                className="min-w-[80px] h-8 px-3 flex items-center justify-center gap-1 
                                           text-xs font-medium rounded text-white bg-yellow-500 hover:bg-yellow-600"
                              >
                                <RotateCcw size={14} /> Retry
                              </button>
                            )}

                            {e.status === "PENDING" && (
                              <button
                                onClick={() => handleDelete(e.id)}
                                className="min-w-[80px] h-8 px-3 flex items-center justify-center gap-1 
                                           text-xs font-medium rounded text-white bg-red-500 hover:bg-red-600"
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
                {essays.map((e) => (
                  <div
                    key={e.id}
                    className="bg-white rounded-xl shadow p-4 space-y-2"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      <span className="font-semibold">Prompt:</span>{" "}
                      {e.prompt?.question || "—"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Status:</span>{" "}
                      {e.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Band:</span>{" "}
                      {e.grading?.overallBand ?? "—"}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 h-9 flex items-center justify-center gap-1 
                                         text-sm font-medium rounded text-white bg-blue-500 hover:bg-blue-600">
                        <Eye size={16} /> View
                      </button>

                      {e.status !== "PENDING" && (
                        <button
                          onClick={() => dispatch(retryEssay(e.id))}
                          className="flex-1 h-9 flex items-center justify-center gap-1 
                                     text-sm font-medium rounded text-white bg-yellow-500 hover:bg-yellow-600"
                        >
                          <RotateCcw size={16} /> Retry
                        </button>
                      )}

                      {e.status === "PENDING" && (
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="flex-1 h-9 flex items-center justify-center gap-1 
                                     text-sm font-medium rounded text-white bg-red-500 hover:bg-red-600"
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
