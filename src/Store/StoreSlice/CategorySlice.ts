import { createSlice } from "@reduxjs/toolkit";
import { ICategory } from "../../interfaces/CategoryInterface";


const intialState={
    categories:[] as ICategory[],
    category:{} as ICategory,
    loading:false
}


const CategorySlice = createSlice({
    name:"Category",
    initialState:intialState,
    reducers:{
        setCategories(state,action){
            state.categories=action.payload;
        },
        setCategory(state,action){
            state.category=action.payload;
        },
        addCategory(state,action){
            state.categories.push(action.payload);
        },
        updateCategory(state,action){
            state.categories = state.categories.map(category => 
                category.id === action.payload.id ? action.payload : category
            );
        },
        deleteCategory(state,action){
            state.categories = state.categories.filter(category => 
                category.id != action.payload
            );
        }
    }
})


export const {setCategories, setCategory, addCategory, updateCategory, deleteCategory} = CategorySlice.actions;
export default CategorySlice.reducer;

