import { AuthResponse, AuthService } from "@/service/AuthService";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface AuthState {
    user : AuthResponse["user"] | null;
    accessToken : string | null;
    loading : boolean;
    error : string | null;
}
const initialState : AuthState = {
    user : null,
    accessToken : null,
    loading : false,
    error : null
}

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await AuthService.login(data.email, data.password);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await AuthService.register(data.name, data.email, data.password);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Register failed");
    }
  }
);

// REFRESH ACCESS TOKEN
export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.refresh(); // backend sẽ đọc refreshToken từ cookie
    } catch (error: any) {
      return rejectWithValue("Refresh token failed");
    }
  }
);

