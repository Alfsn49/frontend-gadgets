import { createAction, props } from "@ngrx/store";

export const loadCart = createAction('[Cart] Load Cart');
export const loadCartSuccess = createAction('[Cart] Load Cart Success',props<{ data:any}>());
export const loadCartFailure = createAction('[Cart] Load Cart Failure', props<{ error: any }>());

export const addToCart = createAction('[Cart] Add To Cart', props<{product_id: number, quantity?: number  }>());
// Para addToCartSuccess
export const addToCartSuccess = createAction(
  '[Cart] Add To Cart Success',
  props<{ cart?: any }>()
);
export const addToCartFailure = createAction('[Cart] Add To Cart Failure',props<{ error: any }>());

// Para reducir cantidad (similar a addToCart pero con lógica inversa)
export const reduceCartItem = createAction(
    '[Cart] Reduce Cart Item', 
    props<{ productId: number }>()  // Solo necesitamos el ID del producto
  );
  // Para reduceCartItemSuccess
export const reduceCartItemSuccess = createAction(
  '[Cart] Reduce Cart Item Success',
  props<{ cart?: any; products: any[] }>()
);
  export const reduceCartItemFailure = createAction(
    '[Cart] Reduce Cart Item Failure',
    props<{ error: any }>()
  );

export const updateCartItem = createAction('[Cart] Update Cart Item', props<{ data: any }>());
export const updateCartItemSuccess = createAction('[Cart] Update Cart Item Success', props<{ data: any }>());
export const updateCartItemFailure = createAction('[Cart] Update Cart Item Failure');

export const removeCartItem = createAction('[Cart] Remove Cart Item', props<{ data: any }>());
export const removeCartItemSuccess = createAction('[Cart] Remove Cart Item Success',  props<{ cart?: any; products: any[] }>());
export const removeCartItemFailure = createAction('[Cart] Remove Cart Item Failure', props<{ error: any }>());