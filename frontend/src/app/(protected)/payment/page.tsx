"use client";

import { useEffect, useState } from "react";
import { paymentService } from "@/service/paymentService";
import PrivateNavbar from "@/components/layout/PrivateNavbar";

export default function PaymentsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    paymentService.getPlans().then((res) => {
      setPlans(res.data);
      if (res.data.length > 0) setSelectedPlan(res.data[0]);
    });
  }, []);

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      const res = await paymentService.checkout(
        selectedPlan.stripePriceId,
        selectedPlan.id
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <PrivateNavbar />

      {/* Nội dung chính */}
      <div className="max-w-5xl mx-auto px-6 py-12 pt-24">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Upgrade Your IELTS Journey ✍️
        </h1>

        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-8">
          {/* LEFT: Plans */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-gray-500 font-semibold text-sm uppercase mb-4">
                Choose a plan
              </h2>
              <div className="space-y-4">
                {plans.map((plan, idx) => (
                  <label
                    key={plan.id}
                    className={`flex justify-between items-center border rounded-lg p-4 cursor-pointer transition
                      ${
                        selectedPlan?.id === plan.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div>
                      <p className="font-medium text-gray-800 flex items-center gap-2">
                        {plan.name}
                        {idx === 0 && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Save 58%
                          </span>
                        )}
                        {idx === 1 && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                            Save 33%
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {plan.credits} credits •{" "}
                        <span className="font-semibold text-green-600">
                          ${(plan.price / 100).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <input
                      type="radio"
                      checked={selectedPlan?.id === plan.id}
                      onChange={() => setSelectedPlan(plan)}
                      className="form-radio text-green-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Pay Button dưới list */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading
                ? "Processing..."
                : `Pay ${
                    selectedPlan
                      ? `$${(selectedPlan.price / 100).toFixed(2)}`
                      : ""
                  }`}
            </button>
          </div>

          {/* RIGHT: Payment + Info */}
          <div>
           

            {/* Điều khoản */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-gray-800 font-semibold mb-3 text-sm">
                Before you buy credits
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 text-xs leading-relaxed">
                <li>Credits are used to submit essays for AI grading.</li>
                <li>1 essay submission = 1 credit.</li>
                <li>Credits never expire, you can use them anytime.</li>
                <li>No refund once credits are used.</li>
                <li>
                  Secure payment with{" "}
                  <span className="font-medium">Visa, Mastercard, PayPal</span>.
                </li>
                <li>
                  Free users get{" "}
                  <strong className="text-green-600">5 free credits</strong> when signing up.
                </li>
              </ul>

              <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                By purchasing, you agree to our{" "}
                <a href="/terms" className="underline hover:text-green-600">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline hover:text-green-600">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
