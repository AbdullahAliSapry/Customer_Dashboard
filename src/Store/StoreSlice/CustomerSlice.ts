import { createSlice } from "@reduxjs/toolkit";
import { IStoreCustomer } from "../../interfaces/StoreCustomerInterface";

const initial = {
    customers: [] as IStoreCustomer[],
    currentCustomer: null as IStoreCustomer | null,
    loading: false,
    error: null,
}

export const CustomerSlice = createSlice({
    name: "customer",
    initialState: initial,
    reducers: {
        setCustomers(state, action) {
            state.customers = action.payload;
            state.loading = false;
        },
        setCurrentCustomer(state, action) {
            state.currentCustomer = action.payload;
            state.loading = false;
        },
        updateCustomer(state, action) {
            state.customers = state.customers.map(customer => customer.id === action.payload.id ? action.payload : customer);
        },
        deleteCustomer(state, action) {
            state.customers = state.customers.filter(customer => customer.id !== action.payload);
        },
        addCustomer(state, action) {
            state.customers.push(action.payload);
        },
    }
})

export const { setCustomers, setCurrentCustomer, updateCustomer, deleteCustomer, addCustomer } = CustomerSlice.actions;
export default CustomerSlice.reducer; 