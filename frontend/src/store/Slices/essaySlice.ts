import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { EssayService } from "@/service/EssayService";

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

// Async actions
export const submitEssay = createAsyncThunk("essay/submit", EssayService.submit);
export const fetchEssay = createAsyncThunk("essays/fetchOne", EssayService.get);
export const listEssays = createAsyncThunk("essays/list", EssayService.list);
export const deleteEssay = createAsyncThunk("essays/delete", EssayService.delete);
export const retryEssay = createAsyncThunk("essays/retry", EssayService.retry);

// Helper normalize
const normalizeEssay = (raw: any) => {
  const id = raw?.id ?? raw?.essayId;
  const status = String(raw?.status ?? "pending").toLowerCase();
  return { ...raw, id, status };
};

const essaySlice = createSlice({
  name: "essays",
  initialState,
  reducers: {
    clearCurrentEssay(state) {
      state.currentEssay = null;
    },
    socketEssayUpdate(state, action) {
      const updated = normalizeEssay(action.payload);
      if (state.currentEssay && (state.currentEssay.id ?? state.currentEssay.essayId) === updated.id) {
        state.currentEssay = updated;
      }
      state.essays = state.essays.map((e) => {
        const eid = e.id ?? e.essayId;
        return eid === updated.id ? updated : e;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEssay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitEssay.fulfilled, (state, action) => {
        state.loading = false;
        const normalized = normalizeEssay(action.payload);
        state.currentEssay = normalized;
        // Đưa lên đầu list, tránh duplicate
        state.essays = [
          normalized,
          ...state.essays.filter((e) => (e.id ?? e.essayId) !== normalized.id),
        ];
      })
      .addCase(submitEssay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Submit failed";
      })
      .addCase(listEssays.fulfilled, (state, action) => {
        state.essays = Array.isArray(action.payload)
          ? action.payload.map(normalizeEssay)
          : [];
      })
      .addCase(fetchEssay.fulfilled, (state, action) => {
        state.currentEssay = normalizeEssay(action.payload);
      })
      .addCase(deleteEssay.fulfilled, (state, action) => {
        const essayId = action.meta.arg;
        state.essays = state.essays.filter((e) => (e.id ?? e.essayId) !== essayId);
        if (state.currentEssay?.id === essayId) state.currentEssay = null;
      })
      .addCase(retryEssay.fulfilled, (state, action) => {
        const essayId = action.meta.arg;
        state.essays = state.essays.map((e) =>
          (e.id ?? e.essayId) === essayId ? { ...e, status: "pending" } : e
        );
        if (state.currentEssay?.id === essayId) {
          state.currentEssay = { ...state.currentEssay, status: "pending" };
        }
      });
  },
});

export const { clearCurrentEssay, socketEssayUpdate } = essaySlice.actions;
export default essaySlice.reducer;
