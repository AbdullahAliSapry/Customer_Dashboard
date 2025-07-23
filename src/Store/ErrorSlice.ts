import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ErrorState {
  message: string | null;
  errors: Record<string, string[]> | null;
}

const initialState: ErrorState = {
  message: null,
  errors: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (
      state,
      action: PayloadAction<{
        message: string;
        errors?: Record<string, string[]>;
      }>
    ) => {
      state.message = action.payload.message;
      state.errors = action.payload.errors || null;
    },
    clearError: (state) => {
      state.message = null;
      state.errors = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
