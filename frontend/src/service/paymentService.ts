import api from "./apiService";

export const paymentService = {
  // Lấy danh sách gói credits
  getPlans: () => api.get("/payments/plans"),

  // Tạo checkout session
  checkout: (priceId: string, planId: number) =>
    api.post("/payments/checkout", { priceId, planId }),

  // ✅ Verify session sau khi checkout thành công
  verifySession: (sessionId: string) =>
    api.get(`/payments/session?sessionId=${sessionId}`),
};
