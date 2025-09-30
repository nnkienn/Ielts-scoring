import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import essayReducer from "./Slices/essaySlice";
import userReducer from "./Slices/userSlice"; // 👈 import userSlice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    essays: essayReducer,
    user: userReducer, // 👈 dùng đúng biến
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
