import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserService } from "@/service/userService";
import { User } from "@/service/AuthService";

interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

// ✅ Lấy thông tin user hiện tại
export const fetchMe = createAsyncThunk(
  "user/me",
  async (_, { rejectWithValue }) => {
    try {
      return await UserService.me();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

// ✅ Update user info
export const updateUser = createAsyncThunk(
  "user/update",
  async (data: { name?: string; email?: string; avatar?: string }, { rejectWithValue }) => {
    try {
      return await UserService.update(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }
);

// ✅ Change password
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (data: { oldPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      return await UserService.changePassword(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to change password");
    }
  }
);

// ✅ Delete account
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (_, { rejectWithValue }) => {
    try {
      return await UserService.remove();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // me
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // update
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.profile = action.payload;
      })

      // change password
      .addCase(changePassword.fulfilled, (state) => {
        // không update profile, chỉ báo success
      })

      // delete
      .addCase(deleteUser.fulfilled, (state) => {
        state.profile = null;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
