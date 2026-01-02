import { createSelector, createFeatureSelector } from "@ngrx/store";
import { CartState } from "./cart.reducer";

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCart = createSelector(
  selectCartState,
  (state) => state?.cart
);


export const selectCartItems = createSelector(
  selectCart,
  (cart) => cart?.items || []
);

export const selectCartLoaded = createSelector(
  selectCartState,
  (state) => state.loaded
);

export const selectCartStatus = createSelector(
  selectCartState,
  (state) => state.status
)
