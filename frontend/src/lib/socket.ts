import { io, Socket } from "socket.io-client";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3000"; // ⚠️ trỏ về cổng Nest, không phải Next

let socket: Socket | null = null;

export const initSocket = (token?: string) => {
  if (!socket) {
    console.log("🔌 Initializing socket...", WS_URL);
    socket = io(WS_URL, {
      auth: token ? { token } : undefined,
      transports: ["websocket"], // giảm lỗi polling khi dev
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });
  }
  return socket;
};

export { socket };
