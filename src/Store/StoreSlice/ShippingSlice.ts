import { createSlice } from "@reduxjs/toolkit";
import { IShippingData } from "../../interfaces/ShippingInterface";


const intial = {
    isActive: false,
    ShippingStore: {} as IShippingData
}


const ShippingSlice = createSlice({
    name: "Shipping",
    initialState: intial,
    reducers: {
        ActivateShipping: (state, action) => {
            state.isActive = true;
            state.ShippingStore = action.payload;
        },
        DeactivateShipping: (state) => {
            state.isActive = false;
            state.ShippingStore = {} as IShippingData;
        },
        GetShippingStore: (state, action) => {
            state.ShippingStore = action.payload;
        }
    }
})

export const { ActivateShipping, DeactivateShipping, GetShippingStore } = ShippingSlice.actions;
export default ShippingSlice.reducer;
