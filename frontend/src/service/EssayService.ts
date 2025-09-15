import api from "./apiService";

export const EssayService = {
  // Submit essay
  async submit(data: {
    promptId?: number;
    question?: string;
    taskType?: string;
    text: string;
  }) {
    const res = await api.post("/essays/submit", data);
    return res.data;
  },

  // Get one essay
  async get(id: number) {
    const res = await api.get(`/essays/${id}`);
    return res.data;
  },

  // List all essays of current user
  async list() {
    const res = await api.get("/essays");
    return res.data;
  },

  // Delete essay (only if status = pending)
  async delete(id: number) {
    const res = await api.delete(`/essays/${id}`);
    return res.data;
  },

  // Retry grading
  async retry(id: number) {
    const res = await api.patch(`/essays/${id}/retry`);
    return res.data;
  },

  // Check duplicate essay (optional)
  async checkDuplicate(text: string) {
    const res = await api.post("/essays/check-duplicate", { text });
    return res.data;
  },
};
