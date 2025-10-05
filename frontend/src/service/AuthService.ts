// src/services/AuthService.ts
import api from "./apiService";

/** Kiểu dữ liệu trả về từ backend */
export interface User {
  id: number;
  email: string;
  name: string;
  roleId?: number;
  role?: { id: number; name: string };

  freeCredits: number;
  paidCredits: number;
  avatar?: string | null;
  googleId?: string | null;
  facebookId?: string | null;
  stripeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const AuthService = {
  // LOGIN
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },

  // REGISTER
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      roleId: 2,
    });
    return data;
  },

  // REFRESH TOKEN (backend đọc cookie HttpOnly)
  async refresh(): Promise<{ accessToken: string }> {
    const { data } = await api.post("/auth/refresh");
    return data;
  },

  // LOGOUT
  async logout() {
    const { data } = await api.post("/auth/logout", {});
    return data;
  },
};

export default AuthService;
