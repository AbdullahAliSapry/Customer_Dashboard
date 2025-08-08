import { createSlice } from "@reduxjs/toolkit";
import { IStoreData } from "../../interfaces/StoreInterface";

interface StoreState {
  stores: IStoreData[];
  currentStore: IStoreData | null;
  loading: boolean;
}

const intialState: StoreState = {
  stores: [],
  currentStore: null,
  loading: false,
};

const StoreSlice = createSlice({
  name: "Store",
  initialState: intialState,
  reducers: {
    SetStores(state, action) {
      state.stores = action.payload;
      state.loading = false;
    },
    SetCurrentStore(state, action) {
      state.currentStore = action.payload;
      state.loading = false;
    },
    SetComponentContent(state, action) {
      if (state.currentStore) {
        state.currentStore.templateDatas.pages[
          action.payload.pageIndex
        ].components[action.payload.componentIndex].componentContents =
          action.payload.componentContents;
      }
    },
  },
});

export const { SetStores, SetCurrentStore, SetComponentContent } =
  StoreSlice.actions;
export default StoreSlice.reducer;
