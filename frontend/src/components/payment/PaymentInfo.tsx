export default function PaymentInfo() {
  return (
    <div className="bg-white rounded-lg shadow p-6 border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Before you buy credits
      </h2>
      <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
        <li>Credits are used to submit essays for AI grading.</li>
        <li>1 essay submission = 1 credit.</li>
        <li>Credits never expire, you can use them anytime.</li>
        <li>No refund once credits are used.</li>
        <li>
          Stripe handles secure payment with{" "}
          <span className="font-medium">Visa, Mastercard, PayPal</span>.
        </li>
        <li>
          Free users get <strong className="text-blue-600">5 free credits</strong> when signing up.
        </li>
      </ul>

      <div className="mt-6 text-xs text-gray-500">
        By purchasing, you agree to our{" "}
        <a href="/terms" className="underline hover:text-blue-600">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline hover:text-blue-600">
          Privacy Policy
        </a>.
      </div>
    </div>
  );
}
