import api from "./apiService";

export const paymentService = {
  // Lấy danh sách gói credits
  getPlans: () => api.get("/payments/plans"),

  checkout: (priceId: string, planId: number) =>
    api.post("/payments/checkout", { priceId, planId }),


};
