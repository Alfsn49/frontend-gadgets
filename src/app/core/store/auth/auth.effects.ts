import { isPlatformBrowser } from "@angular/common";
import { AuthService } from "../../../data-access/auth/auth.service";
import { login, loginAdmin, loginAdminSuccess, loginFailure, loginSuccess, logout,  logoutAdmin,  refreshTokenErr } from "./auth.actions";
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
                    console.log('Respuesta del login:', response);
                    localStorage.setItem('User', JSON.stringify(response.user));
                    localStorage.setItem('token', response.backendTokens.accessToken);
                    localStorage.setItem('refreshToken', response.backendTokens.refreshToken);
                    localStorage.setItem('isAuthenticated', 'true');
                    this.toastr.success('Bienvenido', 'Inicio de sesión exitoso');
                  
                    return loginSuccess({
                        user: response.user,
                        token: response.backendTokens.accessToken,
                        refreshToken: response.backendTokens.refreshToken
                      });
                }),               
        tap(() => {
            const user = JSON.parse(localStorage.getItem('User') || '{}');
          // Después, ya aparte, disparamos loadCart
          this.store.dispatch(loadCart());
           setTimeout(() => {
            if(user.sub.rol ==='admin'){
                this.router.navigate(['/dashboard-admin']);
            }else{
                window.location.href = '/';
            }
            },1000);
        }),
                catchError((error)=>{
                    this.toastr.error('Error', 'Inicio de sesión fallido');
                    return of(loginFailure({error}))
                })
            )
            )
        ))

    loginAdmin$ = createEffect(()=>
        this.actions$.pipe(
            ofType(loginAdmin),
            mergeMap(({email,password})=>
                this.authService.loginAdmin({email,password}).pipe(
                    map((response:any)=>{
                        console.log('Respuesta del login:', response);
                        localStorage.setItem('User', JSON.stringify(response.user));
                        localStorage.setItem('token', response.backendTokens.accessToken);
                        localStorage.setItem('refreshToken', response.backendTokens.refreshToken);
                        localStorage.setItem('isAuthenticated', 'true');
                        this.toastr.success('Bienvenido', 'Inicio de sesión exitoso');
                        this.router.navigate(['/admin/dashboard']);
                        return loginAdminSuccess({
                            user: response.user,
                            token: response.backendTokens.accessToken,
                            refreshToken: response.backendTokens.refreshToken,
                        });
                    }),catchError((error)=>{
                    this.toastr.error('Error', 'Inicio de sesión fallido');
                    return of(loginFailure({error}))
                })
                )
            )
        )  )  

        loadCartAfterLogin$ = createEffect(() =>
            this.actions$.pipe(
              ofType(loginSuccess),
              tap(() => {
                this.store.dispatch(loadCart());
                this.router.navigate(['/']);
              })
            ),
            { dispatch: false }
          );
          
    loggout$ = createEffect(()=>
    this.actions$.pipe(
        ofType(logout),
        tap(()=>{
            localStorage.clear()
            this.toastr.success('Adios', 'Cierre de sesión exitoso');
            this.router.navigate(['/auth/login']);
        })
    ),{dispatch:false})

    logoutAdmin$= createEffect(()=>
    this.actions$.pipe(
        ofType(logoutAdmin),
        tap(()=>{
            localStorage.clear()
            this.toastr.success('Adios', 'Cierre de sesión exitoso');
            this.router.navigate(['/admin/login']);
        })
    ),{dispatch:false}
    )

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