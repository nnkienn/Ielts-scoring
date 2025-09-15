import { EssayService } from "@/service/EssayService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface EssayState {
  essays: any[];
  currentEssay: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: EssayState = {
  essays: [],
  currentEssay: null,
  loading: false,
  error: null,
};

export const submitEssay = createAsyncThunk("essay/submit", EssayService.submit);
export const fetchEssay = createAsyncThunk("essays/fetchOne", EssayService.get);
export const listEssays = createAsyncThunk("essays/list", EssayService.list);
export const deleteEssay = createAsyncThunk("essays/delete", EssayService.delete);
export const retryEssay = createAsyncThunk("essays/retry", EssayService.retry);

const essaySlice = createSlice({
  name: "essays",
  initialState,
  reducers: {
    clearCurrentEssay(state) {
      state.currentEssay = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEssay.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitEssay.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEssay = action.payload;
      })
      .addCase(submitEssay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Submit failed";
      })
      .addCase(listEssays.fulfilled, (state, action) => {
        state.essays = action.payload;
      })
      .addCase(fetchEssay.fulfilled, (state, action) => {
        state.currentEssay = action.payload;
      })
      .addCase(deleteEssay.fulfilled, (state, action) => {
        const essayId = action.meta.arg;
        state.essays = state.essays.filter((e) => e.id !== essayId);
      })
      .addCase(retryEssay.fulfilled, (state, action) => {
        const essayId = action.meta.arg;
        state.essays = state.essays.map((e) =>
          e.id === essayId ? { ...e, status: "PENDING" } : e
        );
      });
  },
});

export const { clearCurrentEssay } = essaySlice.actions;
export default essaySlice.reducer;
