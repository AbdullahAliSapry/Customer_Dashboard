import { combineReducers } from "@reduxjs/toolkit";
import PlansSlice from "./PlansSlice";
import CustomerInfoSlice from "./CustomerInfoSlice";
import StoresSlice from "./StoresSlice";
import TemplatesSlice from "./TemplatesSlice";





export const CustomerReducers = combineReducers({
    customerInfo:CustomerInfoSlice,
    plans:PlansSlice,
    stores:StoresSlice,
    templates:TemplatesSlice,
});

export type RootState = ReturnType<typeof CustomerReducers>;
