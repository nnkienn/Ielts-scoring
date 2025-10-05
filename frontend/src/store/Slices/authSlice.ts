import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, AuthService } from "@/service/AuthService";

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
  error: null,
};

// ---------------- helpers ----------------
function persistAuth(user: AuthState["user"], accessToken: string | null) {
  localStorage.setItem("auth", JSON.stringify({ user, accessToken }));
}

// ---------------- thunks -----------------
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await AuthService.login(data.email, data.password); // { user, accessToken }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await AuthService.register(data.name, data.email, data.password); // { user, accessToken }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Register failed");
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.refresh(); // { accessToken }
    } catch {
      return rejectWithValue("Refresh token failed");
    }
  }
);

// ---------------- slice ------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadAuthFromStorage: (state) => {
      const data = localStorage.getItem("auth");
      if (!data) return;
      const parsed = JSON.parse(data);
      state.user = parsed.user ?? null;
      state.accessToken = parsed.accessToken ?? null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("auth");
      // dọn cookie rt phía server (không cần chờ)
      AuthService.logout().catch(() => {});
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- LOGIN ----------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          persistAuth(state.user, state.accessToken);
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })

      // -------- REGISTER -------
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          persistAuth(state.user, state.accessToken);
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.error = (action.payload as string) || "Register failed";
      })

      // -------- REFRESH --------
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        // chỉ thay token, giữ nguyên user
        state.accessToken = action.payload.accessToken;
        persistAuth(state.user, state.accessToken);
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // Không auto-logout: để interceptor tự xử lý tiếp
      });
  },
});

export const { logout, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
