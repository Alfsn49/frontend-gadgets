import { createAction, props } from "@ngrx/store";

export const login = createAction(
    '[Auth] Login',
    props<{ email: string; password: string }>()
)

export const loginAdmin = createAction(
    '[Auth] Login Admin',
    props<{ email: string; password: string }>()
)


export const loginAdminSuccess = createAction(
    '[Auth] Login Admin Success',
    props<any>()
)



export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<any>()
)

export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<any>()
)

export const logout = createAction(
    '[Auth] Logout'
)

export const logoutAdmin = createAction(
    '[Auth] LogoutAdmin'
)

export const refreshTokenErr = createAction(
    '[Auth] Refresh Token'
)

