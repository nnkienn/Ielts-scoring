// src/services/api.ts
import axios, { AxiosRequestConfig } from "axios";
import { AuthService } from "./AuthService";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  withCredentials: true, // gửi cookie refresh (HTTP-only) khi gọi /auth/refresh
});

// ---------------- Request: đính accessToken ----------------
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const { accessToken } = JSON.parse(raw);
        if (accessToken) {
          config.headers = config.headers || {};
          (config.headers as any).Authorization = `Bearer ${accessToken}`;
        }
      } catch {}
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status as number | undefined;
    const original = (error?.config || {}) as CustomAxiosRequestConfig;

    // Nếu không có config (network error) -> trả về luôn
    if (!original) return Promise.reject(error);

    // Tránh self-refresh loop
    const url = (original.url || "").toString();
    const isRefreshCall = url.includes("/auth/refresh");

    // 402: để UI tự xử lý paywall, KHÔNG redirect ở đây
    if (status === 402) {
      return Promise.reject(error);
    }

    // 401: thử refresh 1 lần (trừ khi chính là refresh call)
    if (status === 401 && !original._retry && !isRefreshCall) {
      if (isRefreshing) {
        // Có refresh đang diễn ra: chờ xong rồi retry
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
        // Gọi service refresh (phải gửi cookie RT)
        const res = await AuthService.refresh(); // { accessToken }
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

          // set header mặc định + flush queue + retry
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          flushQueue(newAccessToken);

          original.headers = original.headers || {};
          (original.headers as any).Authorization = `Bearer ${newAccessToken}`;
          return api(original);
        }

        // Không lấy được token mới
        flushQueue(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth");
        }
        // ❗ Không redirect ở đây — để UI/guard quyết định
        return Promise.reject(error);
      } catch (e) {
        // Refresh fail
        flushQueue(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth");
        }
        // ❗ Không redirect ở đây
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    // Các mã khác: trả về UI xử lý
    return Promise.reject(error);
  }
);

export default api;