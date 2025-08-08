import { createSlice } from "@reduxjs/toolkit";
import { ProductWithTranslation } from "../../interfaces/TranslationInterface";

const initial = {
  productsWithTranslations: [] as ProductWithTranslation[],
  loading: false,
  error: null as string | null,
};

export const ManualTranslationSlice = createSlice({
  name: "manualTranslation",
  initialState: initial,
  reducers: {
        getAllProductsWithTranslations(state, action) {
      state.productsWithTranslations = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTranslation(state, action) {
      // إضافة ترجمة جديدة - سيتم تحديث المنتج الموجود أو إضافة منتج جديد
      const newTranslation = action.payload;
      const existingIndex = state.productsWithTranslations.findIndex(
        item => item.product.id === newTranslation.productId
      );
      
             if (existingIndex !== -1) {
         // تحديث الترجمة للمنتج الموجود
         state.productsWithTranslations[existingIndex].translation = newTranslation;
       } else {
         // إضافة منتج جديد مع ترجمته
         // هذا الحالة نادرة لأن المنتج يجب أن يكون موجوداً أولاً
         console.warn("Product not found for translation:", newTranslation.productId);
       }
      state.loading = false;
      state.error = null;
    },
         updateTranslation(state, action) {
       const updatedTranslation = action.payload;
       const index = state.productsWithTranslations.findIndex(
         item => item.translation?.id === updatedTranslation.id
       );
       if (index !== -1) {
         state.productsWithTranslations[index].translation = updatedTranslation;
       }
       state.loading = false;
       state.error = null;
     },
         deleteTranslation(state, action) {
       const translationId = action.payload;
       const index = state.productsWithTranslations.findIndex(
         item => item.translation?.id === translationId
       );
       if (index !== -1) {
         // إزالة الترجمة من المنتج (ترك المنتج بدون ترجمة)
         state.productsWithTranslations[index].translation = null;
       }
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
  getAllProductsWithTranslations,
  addTranslation,
  updateTranslation,
  deleteTranslation,
  loading,
  setError,
} = ManualTranslationSlice.actions;

export default ManualTranslationSlice.reducer; 