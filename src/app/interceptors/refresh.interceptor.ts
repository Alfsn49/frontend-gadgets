import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../data-access/auth/auth.service";
import { HttpInterceptorFn } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { inject } from "@angular/core";

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  const token = authService.getToken();

  if (req.url.includes('auth/refresh')) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((err: any) => {
      console.log('Error interceptado:', err);
      // Solo manejar errores 401 que no sean de la ruta de refresh
      if (err.status === 401 && !req.url.includes('auth/refresh')) {
        console.log('Error 401 detectado, intentando refrescar token...');

        return authService.refrershToken().pipe(
          switchMap((response: any) => {
            console.log('✅ Token refrescado con éxito', response);

            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('User', JSON.stringify(response.user));
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
                       if (refreshErr.status === 401 || refreshErr.status === 403) {
              toastr.error('Sesión expirada, inicie sesión nuevamente.');
              authService.logout();
              router.navigate(['/auth/login']);
            }
            return throwError(() => refreshErr);
          })
        );
      }

      // Para otros errores (incluyendo 404), simplemente propagarlos
      // sin cerrar sesión
      return throwError(() => err);
    })
  );
};
