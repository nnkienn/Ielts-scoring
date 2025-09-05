import { AuthResponse, AuthService } from "@/service/AuthService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: AuthResponse["user"] | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}
const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null,

        localStorage.removeItem("auth");

      document.cookie = "accessToken=; Max-Age=0; path=/;";
      AuthService.logout().catch(() => { })
    },
    loadAuthFromStorage: (state) => {
      const data = localStorage.getItem("auth");
      if (data) {
        const parsed = JSON.parse(data);
        state.user = parsed.user;
        state.accessToken = parsed.accessToken;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("auth", JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
        }));
        // Cookie cho middleware (Next.js check route)
        document.cookie = `accessToken=${state.accessToken}; path=/;`;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false,
          state.error = action.payload as string;
      })
      //REGISTER
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("auth", JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
        }));
        // Cookie cho middleware (Next.js check route)
        document.cookie = `accessToken=${state.accessToken}; path=/;`;
      })
      //REFRESH;
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;

        const data = localStorage.getItem("auth");
        if (data) {
          const parsed = JSON.parse(data);
          state.user = parsed.user;
          state.accessToken = parsed.accessToken;
        }
        // Cookie cho middleware (Next.js check route)
        document.cookie = `accessToken=${state.accessToken}; path=/;`;
      })


  }
})
export const {logout,loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;