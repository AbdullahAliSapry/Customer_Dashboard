import { createSlice } from "@reduxjs/toolkit";
import { StorePriceOffer } from "../../interfaces/StorePriceOffers";

const initial = {
  priceOffers: [] as StorePriceOffer[],
  currentPriceOffer: null as StorePriceOffer | null,
  loading: false,
  error: null as string | null,
};

export const PriceOffersSlice = createSlice({
  name: "priceOffers",
  initialState: initial,
  reducers: {

    setPriceOffers(state, action) {
      state.priceOffers = action.payload;
      state.loading = false;
    },
    setCurrentPriceOffer(state, action) {
      state.currentPriceOffer = action.payload;
      state.loading = false;
    },
    updatePriceOffer(state, action) {
      state.priceOffers = state.priceOffers.map((offer) =>
        offer.id === action.payload.id ? action.payload : offer
      );
    },
    deletePriceOffer(state, action) {
      state.priceOffers = state.priceOffers.filter(
        (offer) => offer.id !== action.payload
      );
    },
    addPriceOffer(state, action) {
      state.priceOffers.push(action.payload);
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setPriceOffers,
  setCurrentPriceOffer,
  updatePriceOffer,
  deletePriceOffer,
  addPriceOffer,
  setError,
} = PriceOffersSlice.actions;

export default PriceOffersSlice.reducer;
