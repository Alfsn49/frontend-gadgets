import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../data-access/auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();

  // Verificar si la solicitud no es para el endpoint de refresco de token
  if (!req.url.includes('auth/refresh')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq).pipe(
      catchError((err) => {
        console.log(err.status)
        if (err.status === 401) {
          return authService.refrershToken().pipe(
            switchMap((res: any) => {
              console.log('Token refrescado', res);
              localStorage.setItem('User', res.user);
              localStorage.setItem('token', res.accessToken);
              localStorage.setItem('refreshToken', res.refreshToken);

              // Clonar la solicitud original con el nuevo token de acceso
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.accessToken}`
                }
              });

              return next(newReq);
            }),
            catchError((refreshErr) => {
              console.log(refreshErr);
              const finalError = new Error(refreshErr);

              // Eliminar los tokens del almacenamiento local si el refresco falla
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('User');
              localStorage.removeItem('product')

              return throwError(() => finalError);
            })
          );
        }

        return throwError(() => err);
      })
    );
  } else {
    // Para la solicitud de refresh, simplemente pasarla sin modificar
    return next(req);
  }
};
