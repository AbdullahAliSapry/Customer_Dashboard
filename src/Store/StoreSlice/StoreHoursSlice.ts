import { createSlice } from "@reduxjs/toolkit";
import { StoreHouresWorkInterfafce } from "../../interfaces/StoreHouresWorkInterfafce";
import { ErrorInfo } from "../../Api/ApiRepository";

const initial = {
    storeHours: [] as StoreHouresWorkInterfafce[],
    currentStoreHours: null as StoreHouresWorkInterfafce | null,
    loading: false,
    error: null as ErrorInfo | null,
}

export const StoreHoursSlice = createSlice({
    name: "storeHours",
    initialState: initial,
    reducers: {
        setStoreHours(state, action) {
            state.storeHours = action.payload;
            state.loading = false;
        },
        setCurrentStoreHours(state, action) {
            state.currentStoreHours = action.payload;
            state.loading = false;
        },
        updateStoreHours(state, action) {
            state.storeHours = state.storeHours.map(hours => 
                hours.id === action.payload.id ? action.payload : hours
            );
        },
        deleteStoreHours(state, action) {
            state.storeHours = state.storeHours.filter(hours => hours.id !== action.payload);
        },
        addStoreHours(state, action) {
            state.storeHours.push(action.payload);
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        clearError(state) {
            state.error = null;
        }
    }
})

export const { 
    setStoreHours, 
    setCurrentStoreHours, 
    updateStoreHours, 
    deleteStoreHours, 
    addStoreHours,
    setLoading,
    setError,
    clearError
} = StoreHoursSlice.actions;

export default StoreHoursSlice.reducer;