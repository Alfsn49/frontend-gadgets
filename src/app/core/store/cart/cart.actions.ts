import { createAction, props } from "@ngrx/store";

export const loadCart = createAction('[Cart] Load Cart');
export const loadCartSuccess = createAction('[Cart] Load Cart Success', props<{ data: any }>());
export const loadCartFailure = createAction('[Cart] Load Cart Failure', props<{ error: any }>());

export const addToCart = createAction('[Cart] Add To Cart', props<{ data: any }>());
export const addToCartSuccess = createAction('[Cart] Add To Cart Success', props<{ data: any }>());
export const addToCartFailure = createAction('[Cart] Add To Cart Failure');

export const updateCartItem = createAction('[Cart] Update Cart Item', props<{ data: any }>());
export const updateCartItemSuccess = createAction('[Cart] Update Cart Item Success', props<{ data: any }>());
export const updateCartItemFailure = createAction('[Cart] Update Cart Item Failure');

export const removeCartItem = createAction('[Cart] Remove Cart Item', props<{ data: any }>());
export const removeCartItemSuccess = createAction('[Cart] Remove Cart Item Success', props<{ data: any }>());
export const removeCartItemFailure = createAction('[Cart] Remove Cart Item Failure');