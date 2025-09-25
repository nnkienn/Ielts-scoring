"use client";
import { paymentService } from "@/service/paymentService";
import { useEffect, useState, ReactNode } from "react";

export default function PlanList({ icons }: { icons: ReactNode[] }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    paymentService.getPlans().then((res) => setPlans(res.data));
  }, []);

  const handleCheckout = async (plan: any) => {
    setLoading(true);
    try {
      const res = await paymentService.checkout(plan.stripePriceId, plan.id);
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {plans.map((plan, idx) => (
        <div
          key={plan.id}
          className={`rounded-2xl border p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition 
            ${idx === 1 ? "border-blue-500" : "border-gray-200"}`}
        >
          <div className="flex items-center gap-3 mb-3">
            {icons[idx]}
            <p className="text-lg font-semibold text-gray-800">{plan.name}</p>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            {plan.credits} credits •{" "}
            <span className="font-medium text-blue-600">
              ${(plan.price / 100).toFixed(2)}
            </span>
          </p>
          <button
            onClick={() => handleCheckout(plan)}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>
        </div>
      ))}
    </div>
  );
}
