import { createReducer, on } from "@ngrx/store";
import { loadCart, loadCartFailure, loadCartSuccess, addToCart, addToCartFailure, addToCartSuccess, updateCartItem, updateCartItemFailure, updateCartItemSuccess, removeCartItem, removeCartItemFailure, removeCartItemSuccess, reduceCartItem, reduceCartItemSuccess, reduceCartItemFailure } from "./cart.actions";
import { state } from "@angular/animations";
// Función para cargar el carrito desde localStorage
const loadInitialCartState = () => {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : {
      id: null,
      user_id: null,
      total: 0,
      completed: false,
      items: []
    };
  };
  
export interface CartState {
    cart: any;
    status: 'loading' | 'success' | 'error';
    loaded: boolean;
    error: any | null;
  }
  
  export const initialState: CartState = {
    cart: loadInitialCartState(), 
    status: 'loading',
    loaded: false,
    error: null
  };

export const cartReducer = createReducer(
    initialState,
    on(loadCart, (state)=>{
        return{
            ...state,
            loaded: true,
        }
    }),
    on(loadCartSuccess, (state, { cart }) => 
       {return {
        ...state,
        carta:cart,
        loaded: true,
        error: null,
      }}),
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
    on(addToCartSuccess, (state, { cart }) => ({
        ...state,
        cartInfo: cart || state, // Mantiene el existente si no viene nuevo
        cart: cart,
        loaded: true,
      })),
    
      on(addToCartFailure, (state, {error}) => ({
        ...state,
        
        error: error
      })),
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
    on(reduceCartItem, (state, data)=>{
        return{
            ...state,
            data,
            loaded: true,
        }
    }),
    on(reduceCartItemSuccess, (state, { cart }) => ({
        ...state,
        cartInfo: cart || state, // Mantiene el existente si no viene nuevo
        cart: cart,
       
      })),
      on(reduceCartItemFailure, (state, {error}) => ({
        ...state,
        
        error: error
      })),
    on(removeCartItem, (state, data)=>{
        return{
            ...state,
            data,
            loaded: true,
        }
    }),
    on(removeCartItemSuccess, (state, { cart }) => ({
        ...state,
        cart: cart
      })),
    on(removeCartItemFailure, (state, data)=>{
        return{
            ...state,
            data,
            loaded: false,
        }
    }),
)