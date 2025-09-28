"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PrivateNavbar from "@/components/layout/PrivateNavbar";
import Footer from "@/components/layout/Footer";
import { paymentService } from "@/service/paymentService";

// icons
import { CreditCard, DollarSign } from "lucide-react";

type Payment = {
  id: number;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  plan: {
    id: number;
    name: string;
    credits: number;
    price: number;
  };
};

export default function PaymentHistory() {
  const [history, setHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService.getHistory()
      .then((res) => setHistory(res.data))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleString() : "—";

  const StatusChip = ({ status }: { status: string }) => {
    const map: Record<string, string> = {
      succeeded: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      pending: "bg-amber-50 text-amber-700 ring-amber-200",
      failed: "bg-rose-50 text-rose-700 ring-rose-200",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${map[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PrivateNavbar />

      <div className="flex flex-col min-h-screen bg-gray-50 mt-16">
        {/* Header */}
        <section className="grid place-items-center text-center bg-[#edf6f6] px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-teal-700">💳 Payment History</h1>
          <p className="text-sm text-teal-700">Track your purchases and credits</p>
        </section>

        {/* Content */}
        <div className="flex-1 p-6">
          {loading ? (
            <p className="text-gray-500">⏳ Loading transactions...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-500 italic">No transactions found.</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="bg-teal-600 text-white">
                    <tr>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Credits</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((p) => (
                      <tr key={p.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{p.plan?.name || "—"}</td>
                        <td className="px-4 py-3">{p.plan?.credits}</td>
                        <td className="px-4 py-3">
                          ${(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <StatusChip status={p.status} />
                        </td>
                        <td className="px-4 py-3">{formatDate(p.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {history.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl shadow p-4 space-y-2">
                    <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <CreditCard size={16} /> {p.plan?.name}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <DollarSign size={16} /> ${(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Credits:</span> {p.plan?.credits}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-semibold">Status:</span> <StatusChip status={p.status} />
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Date:</span> {formatDate(p.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
