import { isPlatformBrowser } from "@angular/common";
import { AuthService } from "../../../data-access/auth/auth.service";
import { login, loginFailure, loginSuccess, logout,  refreshTokenErr } from "./auth.actions";
import { catchError, map, mergeMap, tap } from "rxjs";
import { of } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { loadCart } from "../cart/cart.actions";


@Injectable()
export class AuthEffects{
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private toastr = inject(ToastrService);
    private router = inject(Router);
    private store = inject(Store); // Inyectar Store
    constructor(){
    }

    login$ = createEffect(()=>
        this.actions$.pipe(
            ofType(login),
            mergeMap(({email, password})=>
            this.authService.login({email, password}).pipe(
                map((response:any)=>{
                    localStorage.setItem('User', JSON.stringify(response.user));
                    localStorage.setItem('token', response.backendTokens.accessToken);
                    localStorage.setItem('refreshToken', response.backendTokens.refreshToken);
                    localStorage.setItem('isAuthenticated', 'true');
                    this.toastr.success('Bienvenido', 'Inicio de sesión exitoso');
                    setTimeout(() => {
                        this.router.navigate(['/']); // Redirigir sin recargar la página
                      }, 50);
                      // 🚀 Despachar la acción para cargar el carrito después del login
                     this.store.dispatch(loadCart());
                    return loginSuccess({
                        user: response.user,
                        token: response.backendTokens.accessToken,
                        refreshToken: response.backendTokens.refreshToken
                      });
                }),
                catchError((error)=>{
                    this.toastr.error('Error', 'Inicio de sesión fallido');
                    return of(loginFailure({error}))
                })
            )
            )
        ))

    loggout$ = createEffect(()=>
    this.actions$.pipe(
        ofType(logout),
        tap(()=>{
            localStorage.removeItem('User');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('isAuthenticated');
            this.toastr.success('Adios', 'Cierre de sesión exitoso');
            this.router.navigate(['/auth/login']);
        })
    ),{dispatch:false})

    errorRefreshToken$ = createEffect(()=>
    this.actions$.pipe(
        ofType(refreshTokenErr),
        tap(()=>{
            localStorage.removeItem('User');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('isAuthenticated');
            this.toastr.error('Error', 'Token expirado');
            this.router.navigate(['/auth/login']);
        })
    ),{dispatch:false})
   
}