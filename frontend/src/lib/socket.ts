import { io, Socket } from "socket.io-client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? API_BASE;

let socket: Socket | null = null;

export const initSocket = (token?: string | null) => {
  if (typeof window === "undefined") return null;

  if (!socket) {
    socket = io(SOCKET_URL!, {
      transports: ["websocket"],
      withCredentials: true,
      auth: token ? { token } : undefined, // null/undefined đều bỏ qua
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
    });

    socket.on("connect", () => console.log("✅ Socket connected:", socket?.id));
    socket.on("disconnect", (r) => console.warn("⚠️ Socket disconnected:", r));
    socket.on("connect_error", (e) => console.error("❌ Socket error:", e.message));
  } else if (token) {
    (socket as any).auth = { token };
    if (!socket.connected) socket.connect();
  }

  return socket;
};
