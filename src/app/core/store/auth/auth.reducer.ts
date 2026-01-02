import { createReducer, on } from "@ngrx/store";
import { login, loginSuccess, loginFailure, logout, refreshTokenErr, loginAdminSuccess, loginAdmin, logoutAdmin, resetLoginState } from "./auth.actions";


export interface AuthState{
    user:any | null;
    token:string | null;
    refreshToken:string | null;
    isAuthenticated:boolean;
    status: 'loading' | 'success' | 'error'| 'idle';
    error:any | null;
    loading: any | null;
}

export const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('User') || 'null'),
    token:localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    status: 'idle',
    error: null,
    loading: false
}

export const authReducer = createReducer(
    initialState,
    on(login, (state) => {
        return {
            ...state,
            loading: true,
            error: null,
            status: 'loading' as const
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
            status: 'success' as const,
            error:null
        }
    }),
    on(loginAdmin,(state)=>{
        return {
            ...state,
            loading: true,
            error: null,
            status: 'loading' as const
        }
    }),
    on(loginAdminSuccess,(state,{user, token, refreshToken})=>{
        return{
            ...state,
            user,
            token,
            refreshToken,
            isAuthenticated:true,
            status: 'success' as const,
            loading:false,
            error:null
        }
    }),
    on(loginFailure,(state,{error})=>{
        return{
            ...state,
            error,
            isAuthenticated:false,
            loading:false,
            status: 'error' as const,
        }
    }),
    on(logout, (state) =>({

        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
        status: 'idle' as const
    })),
    on(
        logoutAdmin,(state)=>({
            ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
        })
    ),
    on(refreshTokenErr,(state)=>({
        ...state,
        loading:false,
        error:null,
        isAuthenticated:false,
        user:null,
        token:null,
    })),
    // Agrega esta nueva acción para resetear el estado de login
    on(resetLoginState, (state) => ({
        ...state,
        status: 'idle' as const,
        error: null,
        loading: false
    }))
    
)