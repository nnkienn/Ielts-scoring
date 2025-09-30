import api from "./apiService";

export const UserService = {
  // ✅ Lấy thông tin user hiện tại
  async me() {
    const res = await api.get("/users/me");
    return res.data;
  },

  // ✅ Update thông tin user
  async update(data: {
    name?: string;
    email?: string;
    avatar?: string;
  }) {
    const res = await api.patch("/users/update", data);
    return res.data;
  },

  // ✅ Đổi mật khẩu
  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }) {
    const res = await api.patch("/users/change-password", data);
    return res.data;
  },

  // ✅ Xoá tài khoản
  async remove() {
    const res = await api.delete("/users");
    return res.data;
  },
};
