import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { CurrentStoreReducers } from "./StoreSlice/CurrentStoreReducers";
import AuthReducer from "./DashBoardSlice/AuthSlice";
import CreateStoreReducer from "./StoreSlice/CreateStoreSlice";
import errorReducer from "./ErrorSlice";
import CustomerInfoReducer from "./DashBoardSlice/CustomerInfoSlice";
import { IAuthState } from "../interfaces/AuthInterface";
import { ICustomerData } from "../interfaces/CustomerInterface";
import { CustomerReducers } from "./DashBoardSlice/CustomerReducers";
import contentReducer from "./StoreSlice/ContentSlice";
import OrdersReducer from "./StoreSlice/OrderSlice";
import ticketReducer from "./DashBoardSlice/ticketSlice";
import StoreHoursReducer from "./StoreSlice/StoreHoursSlice";
import PriceOffersReducer from "./StoreSlice/PriceOffersSlice";
import StoreLanguageReducer from "./StoreSlice/StoreLanguageSlice";
import ManualTranslationReducer from "./StoreSlice/ManualTranslationSlice";

export const store = configureStore({
  reducer: {
    customer: CustomerInfoReducer,
    currentStore: CurrentStoreReducers,
    Auth: AuthReducer,
    Dashboard: CustomerReducers,
    createStore: CreateStoreReducer,
    error: errorReducer,
    content: contentReducer,
    orders: OrdersReducer,
    tickets: ticketReducer,
    storeHours: StoreHoursReducer,
    priceOffers: PriceOffersReducer,
    storeLanguages: StoreLanguageReducer,
    manualTranslation: ManualTranslationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Type guards
export const isAuthState = (state: unknown): state is IAuthState => {
  return (
    state !== null &&
    typeof state === "object" &&
    "user" in state &&
    "token" in state &&
    "loading" in state
  );
};

export const isCustomerData = (data: unknown): data is ICustomerData => {
  return (
    data !== null &&
    typeof data === "object" &&
    "id" in data &&
    "location" in data &&
    "nationality" in data
  );
};
