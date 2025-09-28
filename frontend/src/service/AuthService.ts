import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // backend NestJS
  withCredentials: true, // ⚡ cho phép cookie (refreshToken) đi kèm
});

// ✅ Kiểu dữ liệu trả về từ backend
// ✅ Kiểu dữ liệu trả về từ backend
export interface User {
  id: number;
  email: string;
  name: string;
  roleId?: number;
  role?: { id: number; name: string };

  // 👇 thêm các field backend trả về
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


// AuthService: login, register, refresh
export const AuthService = {
  // LOGIN
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      roleId: 2,
    });
    return res.data;
  },

  // REFRESH TOKEN → backend đọc từ cookie HttpOnly
  refresh: async (): Promise<{ accessToken: string }> => {
    const res = await api.post("/auth/refresh");
    return res.data;
  },
   logout: async () => {
    const res = await api.post("/auth/logout", {}, { withCredentials: true });
    return res.data;
  },
  
};

export default api;