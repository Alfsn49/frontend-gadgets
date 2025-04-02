import { createReducer, on } from "@ngrx/store";
import { loadCart, loadCartFailure, loadCartSuccess, addToCart, addToCartFailure, addToCartSuccess, updateCartItem, updateCartItemFailure, updateCartItemSuccess, removeCartItem, removeCartItemFailure, removeCartItemSuccess } from "./cart.actions";
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
    error: any | null;
  }
  
  export const initialState: CartState = {
    cart: loadInitialCartState(), 
    status: 'loading',
    error: null
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
    on(loadCartSuccess, (state, { data }) => ({
        ...state,
        data
     
      })),
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