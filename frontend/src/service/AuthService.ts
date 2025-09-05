import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // backend NestJS
  withCredentials: true, // ⚡ cho phép cookie (refreshToken) đi kèm
});

// ✅ Kiểu dữ liệu trả về từ backend
export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role?: string;
  };
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