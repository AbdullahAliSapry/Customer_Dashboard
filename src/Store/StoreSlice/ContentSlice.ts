import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IComponentContent } from '../../interfaces/StoreInterface';

interface ContentState {
  currentContent: IComponentContent | null;
  isEditing: boolean;
  pageIndex: number;
  componentIndex: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  currentContent: null,
  isEditing: false,
  pageIndex: 0,
  componentIndex: 0,
  isLoading: false,
  error: null
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setCurrentContent: (state, action: PayloadAction<IComponentContent>) => {
      state.currentContent = action.payload;
    },
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload;
    },
    setComponentIndex: (state, action: PayloadAction<number>) => {
      state.componentIndex = action.payload;
    },
    startEditing: (state) => {
      state.isEditing = true;
    },
    stopEditing: (state) => {
      state.isEditing = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateContent: (state, action: PayloadAction<Partial<IComponentContent>>) => {
      if (state.currentContent) {
        state.currentContent = {
          ...state.currentContent,
          ...action.payload
        };
      }
    },
    updateButtonText: (state, action: PayloadAction<{ index: number, text: string }>) => {
      if (state.currentContent && state.currentContent.buttonText) {
        const newButtonText = [...state.currentContent.buttonText];
        newButtonText[action.payload.index] = action.payload.text;
        state.currentContent.buttonText = newButtonText;
      }
    },
    addButton: (state) => {
      if (state.currentContent) {
        state.currentContent.buttonText = [
          ...(state.currentContent.buttonText || []),
          "New Button"
        ];
      }
    },
    removeButton: (state, action: PayloadAction<number>) => {
      if (state.currentContent && state.currentContent.buttonText) {
        const newButtonText = [...state.currentContent.buttonText];
        newButtonText.splice(action.payload, 1);
        state.currentContent.buttonText = newButtonText;
      }
    }
  }
});

export const { 
  setCurrentContent, 
  setPageIndex, 
  setComponentIndex, 
  startEditing, 
  stopEditing, 
  setLoading, 
  setError,
  updateContent,
  updateButtonText,
  addButton,
  removeButton
} = contentSlice.actions;

export default contentSlice.reducer; 