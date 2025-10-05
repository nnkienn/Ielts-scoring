import axios, { AxiosRequestConfig } from "axios";
import { AuthService } from "./AuthService";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // cần để gửi cookie "rt" (httpOnly) cho /auth/refresh
});

// ---------------- Request: gắn Authorization ----------------
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const { accessToken } = JSON.parse(raw);
        if (accessToken) {
          config.headers = config.headers ?? {};
          (config.headers as any).Authorization = `Bearer ${accessToken}`;
        }
      } catch {
        // ignore JSON parse error
      }
    }
  }
  return config;
});

// ---------------- Response: refresh 1 lần khi 401 ----------------
let isRefreshing = false;
let waitQueue: Array<(token: string | null) => void> = [];

function flushQueue(newToken: string | null) {
  waitQueue.forEach((cb) => cb(newToken));
  waitQueue = [];
}

function isAuthUrl(url = "") {
  return (
    url.includes("/auth/refresh") ||
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/logout")
  );
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status as number | undefined;
    const original = (error?.config || {}) as CustomAxiosRequestConfig;

    if (!original) return Promise.reject(error);

    const url = (original.url || "").toString();

    // để UI tự xử lý
    if (status === 402) return Promise.reject(error);

    // 401 -> thử refresh 1 lần (không áp dụng cho các endpoint auth)
    if (status === 401 && !original._retry && !isAuthUrl(url)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitQueue.push((token) => {
            if (!token) return reject(error);
            original.headers = original.headers || {};
            (original.headers as any).Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const res = await AuthService.refresh(); // BE đọc cookie rt
        const newAccessToken = res?.accessToken;

        if (newAccessToken) {
          // cập nhật localStorage
          if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem("auth");
              const obj = raw ? JSON.parse(raw) : {};
              obj.accessToken = newAccessToken;
              localStorage.setItem("auth", JSON.stringify(obj));
            } catch {}
          }

          // set header mặc định và retry các request đang đợi
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          flushQueue(newAccessToken);

          original.headers = original.headers || {};
          (original.headers as any).Authorization = `Bearer ${newAccessToken}`;
          return api(original);
        }

        // không lấy được token mới
        flushQueue(null);
        if (typeof window !== "undefined") localStorage.removeItem("auth");
        return Promise.reject(error);
      } catch (e) {
        flushQueue(null);
        if (typeof window !== "undefined") localStorage.removeItem("auth");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
