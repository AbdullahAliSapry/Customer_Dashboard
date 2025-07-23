import { createSlice } from "@reduxjs/toolkit";
import { IOrder } from "../../interfaces/OrderInterface";

const initial = {
    orders: [] as IOrder[],
    currentOrder: null as IOrder | null,
    loading: false
}

export const OrderSlice = createSlice({
    name: "order",
    initialState: initial,
    reducers: {
        setOrders(state, action) {
            state.orders = action.payload;
            state.loading = false;
        },
        setCurrentOrder(state, action) {
            state.currentOrder = action.payload;
            state.loading = false;
        },
        updateOrder(state, action) {
            state.orders = state.orders.map(order => order.id === action.payload.id ? action.payload : order);
        },
        deleteOrder(state, action) {
            state.orders = state.orders.filter(order => order.id !== action.payload);
        },
        addOrder(state, action) {
            state.orders.push(action.payload);
        }
    }
})

export const { setOrders, setCurrentOrder, updateOrder, deleteOrder, addOrder } = OrderSlice.actions;
export default OrderSlice.reducer; 