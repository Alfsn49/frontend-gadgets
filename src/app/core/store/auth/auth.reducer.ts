import { createReducer, on } from "@ngrx/store";
import { login, loginSuccess, loginFailure, logout, refreshTokenErr, loginAdminSuccess, loginAdmin } from "./auth.actions";


export interface AuthState{
    user:any | null;
    token:string | null;
    refreshToken:string | null;
    isAuthenticated:boolean;
    error:any | null;
    loading: any | null;
}

export const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('User') || 'null'),
    token:localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated') || "null"), // Si hay token, está autenticado
    error: null,
    loading: false
}

export const authReducer = createReducer(
    initialState,
    on(login, (state) => {
        return {
            ...state,
            loading: true,
            error: null
        }
    }),
    on(loginSuccess,(state,{user, token, refreshToken})=>{
        return{
            ...state,
            user,
            token,
            refreshToken,
            isAuthenticated:true,
            loading:false,
            error:null
        }
    }),
    on(loginAdmin,(state)=>{
        return {
            ...state,
            loading: true,
            error: null
        }
    }),
    on(loginAdminSuccess,(state,{user, token, refreshToken})=>{
        return{
            ...state,
            user,
            token,
            refreshToken,
            isAuthenticated:true,
            loading:false,
            error:null
        }
    }),
    on(loginFailure,(state,{error})=>{
        return{
            ...state,
            error,
            isAuthenticated:false,
            loading:false
        }
    }),
    on(logout, (state) =>({

        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
    })),
    on(refreshTokenErr,(state)=>({
        ...state,
        loading:false,
        error:null,
        isAuthenticated:false,
        user:null,
        token:null,
    }))
    
)