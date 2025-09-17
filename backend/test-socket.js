import { io } from "socket.io-client";

// ✅ đổi đúng port backend bạn đang chạy (mặc định NestJS = 3000)
const socket = io("http://localhost:3000", {
  transports: ["websocket"], // ép dùng websocket
});

socket.on("connect", () => {
  console.log("✅ Connected to WS server:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connect error:", err.message);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from WS server");
});

// 🔹 Lắng nghe event essayUpdated
socket.on("essayUpdated", (data) => {
  console.log("📩 essayUpdated event:", JSON.stringify(data, null, 2));
});

// 🔹 Debug: log mọi event nhận được
socket.onAny((event, ...args) => {
  console.log("📡 Event received:", event, args);
});
