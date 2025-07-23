import { createSlice } from "@reduxjs/toolkit";
import { IPayment } from "../../interfaces/PaymentInterface";

const initial = {
    payments: [] as IPayment[],
    currentPayment: null as IPayment | null,
    loading: false
}

export const PaymentSlice = createSlice({
    name: "payment",
    initialState: initial,
    reducers: {
        setPayments(state, action) {
            state.payments = action.payload;
            state.loading = false;
        },
        setCurrentPayment(state, action) {
            state.currentPayment = action.payload;
            state.loading = false;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
})

export const { setPayments, setCurrentPayment, setLoading } = PaymentSlice.actions;
export default PaymentSlice.reducer; 