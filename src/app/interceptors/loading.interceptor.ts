import { HttpInterceptorFn } from '@angular/common/http';
import { BusyService } from '../services/busy.service';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  // Evitar activar la animación si la solicitud es para la búsqueda
  if (req.url.includes('/search')) {
    return next(req);
  }
  busyService.busy();
  return next(req).pipe(
    delay(2000),
    finalize(()=> busyService.idle())
  );
};
