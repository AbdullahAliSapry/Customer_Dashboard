import { createSlice } from "@reduxjs/toolkit";
import { IPlan } from "../../interfaces/PlansInterface";

const intialState={
    plans : [] as IPlan[],
    yourPlan:{}as IPlan,
    loading:false
};

const PlansSlice = createSlice({
    name:"Plans",
    initialState:intialState,
    reducers:{
        SetPlans(state,action){
            state.plans=action.payload;
        },
        SetYourPlan(state,action){
            state.yourPlan=action.payload;
        },
        SetLoading(state,action){
            state.loading=action.payload;
        }
    }
})

export const {SetPlans,SetYourPlan,SetLoading} = PlansSlice.actions;
export default PlansSlice.reducer;
