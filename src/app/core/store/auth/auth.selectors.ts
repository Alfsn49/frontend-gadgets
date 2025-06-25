import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducer";


export const selectAuthState = createFeatureSelector<AuthState>('auth');


export const selectUser = createSelector(
    selectAuthState,
    state => state.user
)

export const selectIsAuthenticated = createSelector(
    selectAuthState,
    state => state.isAuthenticated
)

export const selectError = createSelector(
    selectAuthState,
    state => state.error
)

export const selectLoading = createSelector(
    selectAuthState,
    state => state.loading
)

export const selectRole = createSelector(
    selectAuthState,
    state => state.user?.role
)

