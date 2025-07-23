import { createSlice } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces/ProductInterface";

const intial={
    products:[] as IProduct[],
    currentProduct:null as IProduct | null,
    loading:false
}

export const ProductSlice = createSlice({
    name:"product",
    initialState :intial,
    reducers:{
        setProducts(state,action){
            state.products = action.payload;
            state.loading = false;
        },
        setCurrentProduct(state,action){
            state.currentProduct = action.payload;
            state.loading = false;
        },
        updateProduct(state,action){
            state.products = state.products.map(product => product.id === action.payload.id ? action.payload : product);
        },
        deleteProduct(state,action){
            state.products = state.products.filter(product => product.id != action.payload);
        },
        addProduct(state,action){
            state.products.push(action.payload);
        }
    }
})

export const {setProducts, setCurrentProduct, updateProduct, deleteProduct, addProduct} = ProductSlice.actions;
export default ProductSlice.reducer;
