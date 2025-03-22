import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../data-access/auth/auth.service';
import { catchError, switchMap, throwError, filter, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { refreshTokenErr } from '../core/store/auth/auth.actions';
import { Subject } from 'rxjs';

const refreshTokenSubject = new Subject<string>(); // Para gestionar las solicitudes en espera

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const store = inject(Store);
  const token = authService.getToken();
 

  // Verificar si la solicitud no es para refrescar el token y si hay un token actual
  if (!req.url.includes('auth/refresh')) {
    console.log("funcionando")
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq).pipe(
      catchError((err: any) => {
        if (err.status === 401) {
          if (!authService.isRefreshingToken) {
            authService.isRefreshingToken = true;
            refreshTokenSubject.next('');

            return authService.refrershToken().pipe(
              switchMap((response: any) => {
                // Guardamos el nuevo token y notificamos a las solicitudes en espera
                localStorage.setItem('User', JSON.stringify(response.user));
                localStorage.setItem('token', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);

                authService.isRefreshingToken = false;
                refreshTokenSubject.next(response.accessToken); // Notificar a las solicitudes en espera

                // Reintentar la solicitud original con el nuevo token
                const newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.accessToken}`
                  }
                });

                toastr.success('Token refrescado');
                return next(newReq);
              }),
              catchError((refreshErr: any) => {
                console.log('Error al refrescar el token:', refreshErr);
                store.dispatch(refreshTokenErr());
                authService.isRefreshingToken = false;
                return throwError(() => new Error('No se pudo refrescar el token'));
              })
            );
          } else {
            // Si ya se está refrescando, esperar a que se complete y usar el nuevo token
            return refreshTokenSubject.pipe(
              filter(token => !!token), // Esperar hasta que haya un token válido
              take(1), // Tomar solo el primer valor emitido
              switchMap((newToken) => {
                const newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next(newReq);
              })
            );
          }
        }
        return throwError(() => err);
      })
    );
  }

  // Para la solicitud de refresh, pasamos la solicitud sin modificar
  return next(req);
};
