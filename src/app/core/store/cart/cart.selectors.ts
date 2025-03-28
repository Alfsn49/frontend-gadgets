import { createSelector, createFeatureSelector } from "@ngrx/store";
import { CartState } from "./cart.reducer";

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCart = createSelector(
    selectCartState,
    (state: CartState) => state.products
)