"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { paymentService } from "@/service/paymentService";
import { CheckCircle2, XCircle } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "fail" | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    paymentService
      .verifySession(sessionId)
      .then((res) => {
        if (res.data.payment_status === "paid") {
          setStatus("success");
        } else {
          setStatus("fail");
        }
      })
      .catch(() => setStatus("fail"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {status === "success" ? (
          <>
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="mt-4 text-2xl font-bold text-gray-800">
              Payment Successful 🎉
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              Your credits have been added to your account.
            </p>
            <a
              href="/homepage"
              className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Go to Dashboard
            </a>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold text-gray-800">
              Payment Failed ❌
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              Something went wrong. Please contact support.
            </p>
            <a
              href="/plans"
              className="mt-6 inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
            >
              Back to Plans
            </a>
          </>
        )}
      </div>
    </div>
  );
}
