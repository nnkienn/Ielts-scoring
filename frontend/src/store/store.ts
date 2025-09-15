import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice"
import essayReducer from "./Slices/essaySlice"
export const store = configureStore({
    reducer:{
        auth : authReducer,
        essays : essayReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;