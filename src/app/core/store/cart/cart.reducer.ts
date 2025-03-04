import { createReducer, on } from "@ngrx/store";
import { loadCart, loadCartFailure, loadCartSuccess, addToCart, addToCartFailure, addToCartSuccess, updateCartItem, updateCartItemFailure, updateCartItemSuccess, removeCartItem, removeCartItemFailure, removeCartItemSuccess } from "./cart.actions";

export interface CartState {
  products: any[];
  status: 'loading' | 'success' | 'error';
  loaded: boolean;
}

export const initialState: CartState = {
  products: [],
  status: 'loading',
  loaded: false,
};

export const cartReducer = createReducer(
    initialState,
    on(loadCart, (state, data)=>{
        return{
            ...state,
            data,
            loaded: true,
        }
    }),
    on(loadCartSuccess, (state, data)=>{
        return{
            ...state,
            data,
            loaded: true,
        }
    }),
    on(loadCartFailure, (state, data)=>{
        return{
            ...state,
            data,
            loaded: false,
        }
    }),
    on(addToCart, (state, data)=>{
        return{
            ...state,
            data,
            loaded: true,
        }
    }),
    on(addToCartSuccess, (state, data)=>{
        return{
            ...state,
            data,
            loaded: true,
        }
    }),
    on(addToCartFailure, (state, data)=>{
        return{
            ...state,
            data,
            loaded: false,
        }
    }),
    on(updateCartItem, (state, data)=>{
        return{
            ...state,
            data,
            loaded: true,
        }
    }),
    on(updateCartItemSuccess, (state, data)=>{
        return{
            ...state,
            data,
            loaded: true,
        }
    }),
    on(updateCartItemFailure, (state, data)=>{
        return{
            ...state,
            data,
            loaded: false,
        }
    }),
    on(removeCartItem, (state, data)=>{
        return{
            ...state,
            data,
            loaded: true,
        }
    }),
    on(removeCartItemSuccess, (state, data)=>{
        return{
            ...state,
            data,
            loaded: true,
        }
    }),
    on(removeCartItemFailure, (state, data)=>{
        return{
            ...state,
            data,
            loaded: false,
        }
    }),
)