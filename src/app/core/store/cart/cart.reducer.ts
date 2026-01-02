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

  // === Load Cart ===
  on(loadCart, (state) => ({
    ...state,
    loaded: false,
    status: 'loading' as const,
  })),

  on(loadCartSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loaded: true,
    error: null,
    status: 'success' as const,
  })),

  on(loadCartFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    error,
    status: 'error' as const,
  })),

  // === Add ===
  on(addToCart, (state) => ({
    ...state,
    status: 'loading' as const,
  })),

  on(addToCartSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loaded: true,
    status: 'success' as const,
  })),

  on(addToCartFailure, (state, { error }) => ({
    ...state,
    error,
    status: 'error' as const,
  })),

  // === Update ===
  on(updateCartItem, (state) => ({
    ...state,
    status: 'loading' as const,
  })),

  on(updateCartItemSuccess, (state, data) => ({
    ...state,
    data,
    loaded: true,
    status: 'success' as const,
  })),

  on(updateCartItemFailure, (state, error) => ({
    ...state,
    error,
    status: 'error' as const,
  })),

  // === Reduce ===
  on(reduceCartItem, (state) => ({
    ...state,
    status: 'loading' as const,
  })),

  on(reduceCartItemSuccess, (state, { cart }) => ({
    ...state,
    cart,
    status: 'success' as const,
  })),

  on(reduceCartItemFailure, (state, { error }) => ({
    ...state,
    error,
    status: 'error' as const,
  })),

  // === Remove ===
  on(removeCartItem, (state) => ({
    ...state,
    status: 'loading' as const,
  })),

  on(removeCartItemSuccess, (state, { cart }) => ({
    ...state,
    cart,
    status: 'success' as const,
  })),

  on(removeCartItemFailure, (state, { error }) => ({
    ...state,
    error,
    status: 'error' as const,
  }))
);
