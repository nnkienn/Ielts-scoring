"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/hook/useAppDispatch";
import { socketEssayUpdate } from "@/store/Slices/essaySlice";
import { initSocket } from "@/lib/socket";

export const useEssaySocket = (essayId?: number) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!essayId) return;
    const socket = initSocket();
    const eventName = `essay_update_${essayId}`;

    // 👈 join room
    socket.emit("joinEssay", { essayId });

    socket.off(eventName);
    socket.on(eventName, (data) => {
      console.log("📩 Realtime essay update:", data);
      dispatch(socketEssayUpdate(data));
    });

    return () => {
      socket.off(eventName);
    };
  }, [essayId, dispatch]);
};
