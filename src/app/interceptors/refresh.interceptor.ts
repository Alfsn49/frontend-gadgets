import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../data-access/auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const token = authService.getToken();
  const refreshToken = localStorage.getItem('refreshToken') || '';

  let shouldClearStorage = false; 

  // Verificar si la solicitud no es para el endpoint de refresco de token
  if (!req.url.includes('auth/refresh') && token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq).pipe(
      catchError((err: any) => {
        if (err.status === 401 && !authService.isRefreshingToken) {
          authService.isRefreshingToken = true; // Marcamos que se está refrescando el token

          // Iniciar la solicitud para refrescar el token
          return authService.refrershToken().pipe(
            switchMap((response: any) => {
              // Almacenar los nuevos tokens en localStorage
              localStorage.setItem('User', JSON.stringify(response.user));
              localStorage.setItem('token', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);

              // Clonar la solicitud original con el nuevo token de acceso
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                }
              });

              toastr.success('Token refrescado');
              authService.isRefreshingToken = false; // Desmarcar que se terminó el refresco
              return next(newReq); // Ejecutar la solicitud con el nuevo token
            }),
            catchError((refreshErr: any) => {
              console.log('Error al refrescar el token:', refreshErr);
              const finalError = new Error('No se pudo refrescar el token');
              authService.isRefreshingToken = false; // Desmarcar el refresco
              // Eliminar los tokens del almacenamiento local si el refresco falla
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('User');
              localStorage.removeItem('product'); // O lo que sea necesario
              localStorage.removeItem('isAuthenticated');

              toastr.error('Hubo un error al intentar refrescar el token. Por favor, vuelve a iniciar sesión.');
              authService.isRefreshingToken = false; // Desmarcar el refresco

              return throwError(() => finalError);
            })
          );
        }

        // Si no es 401 o si ya se está refrescando el token, simplemente retornamos el error
        return throwError(() => err);
      })
    );
  }

  // Para la solicitud de refresh, simplemente pasamos la solicitud sin modificar
  return next(req);
};
