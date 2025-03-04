import { createAction, props } from "@ngrx/store";

export const login = createAction(
    '[Auth] Login',
    props<{ email: string; password: string }>()
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


