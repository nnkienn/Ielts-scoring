"use client";

import { paymentService } from "@/service/paymentService";
import { useEffect, useState } from "react";
import PrivateNavbar from "@/components/layout/PrivateNavbar";

type Plan = {
  id: number;
  name: string;
  price: number;
  credits: number;
  stripePriceId: string;
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService
      .getPlans()
      .then((res) => setPlans(res.data))
      .catch((err) => console.error("❌ Lỗi khi load plans:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async (plan: Plan) => {
    try {
      const res = await paymentService.checkout(plan.stripePriceId, plan.id);
      window.location.href = res.data.url; // Stripe redirect
    } catch (err) {
      console.error("❌ Checkout error:", err);
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
          <PrivateNavbar />
         <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Chọn gói credits</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border rounded-lg p-6 text-center shadow-md"
          >
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="text-gray-600 mt-2">
              ${(plan.price / 100).toFixed(2)} – {plan.credits} credits
            </p>
            <button
              onClick={() => handleCheckout(plan)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Mua ngay
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
   
  );
}
