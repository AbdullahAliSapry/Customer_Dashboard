import { createSlice } from "@reduxjs/toolkit";
import { StoreLanguageDto } from "../../interfaces/Languageinterface";

const initial = {
  storeLanguages: [] as StoreLanguageDto[],
  loading: false,
  error: null as string | null,
};

export const StoreLanguageSlice = createSlice({
  name: "storeLanguage",
  initialState: initial,
  reducers: {
    getAll(state, action) {
      state.storeLanguages = action.payload;
      state.loading = false;
      state.error = null;
    },
    addLanguage(state, action) {
      state.storeLanguages.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    delete(state, action) {
      state.storeLanguages = state.storeLanguages.filter(
        (language) => language.id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },
    loading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  getAll,
  addLanguage,
  delete: deleteLanguage,
  loading,
  setError,
} = StoreLanguageSlice.actions;
export default StoreLanguageSlice.reducer; 