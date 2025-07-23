import { combineReducers } from "@reduxjs/toolkit";

import TemplateSlice from "./TemplateSlice";
import CategorySlice from "./CategorySlice";
import ProductsSlice from "./ProductSlice";
import OrderSlice from "./OrderSlice";
import CustomerSlice from "./CustomerSlice";
import PaymentSlice from "./PaymentSlice";
import ShippingSlice from "./ShippingSlice";
export const CurrentStoreReducers = combineReducers({
    products: ProductsSlice,
    template: TemplateSlice,
    category: CategorySlice,
    orders: OrderSlice,
    customers: CustomerSlice,
    payments: PaymentSlice,
    shipping: ShippingSlice
})


