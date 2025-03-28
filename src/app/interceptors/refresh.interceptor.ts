import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  
  const token = authService.getToken();

  if (!req.url.includes('auth/refresh')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq).pipe(
      catchError((err: any) => {
        if (err.status === 401) {
          console.log('Error 401 detectado, intentando refrescar token...');

          // Intentar refrescar el token solo si es necesario
          return authService.refrershToken().pipe(
            switchMap((response: any) => {
              console.log('✅ Token refrescado con éxito', response);
              console.log('refreshtoken', response.refreshToken);
              console.log('accesstoken', response.accessToken);
              // Guardar los nuevos tokens
              localStorage.setItem('User', JSON.stringify(response.user));
              localStorage.setItem('token', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);
              localStorage.setItem('isAuthenticated', 'true');

              // Reintentar la solicitud original con el nuevo token
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                }
              });

              return next(newReq);
            }),
            catchError((refreshErr: any) => {
              console.log('⛔ Error al refrescar el token:', refreshErr);
              toastr.error('Sesión expirada, inicie sesión nuevamente.');
              localStorage.clear();
              router.navigate(['/auth/login']);
              return throwError(() => new Error('No se pudo refrescar el token'));
            })
          );
        }

        return throwError(() => err);
      })
    );
  }

  return next(req);
};
