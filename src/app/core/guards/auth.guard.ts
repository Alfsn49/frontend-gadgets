import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthState } from '../store/auth/auth.reducer';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);

  const currentUrl = state.url;
  const requiredRole = route.data?.['role'] as string | string[] | undefined;

  return store.select(s => s.auth).pipe(
    map(auth => {
      const { isAuthenticated, user } = auth;
      console.log('AuthGuard - isAuthenticated:', isAuthenticated);
      console.log('AuthGuard - user:', user);
      // 1. Si no está autenticado
      if (!isAuthenticated) {
        // Si intenta entrar a algo que no sea /admin/login o /auth/login
        if (!currentUrl.startsWith('/auth/login') && !currentUrl.startsWith('/auth-admin/login')) {
          router.navigate(['/auth/login']);
          return false;
        }
        return true; // sí puede ir al login
      }

      // 2. Si ya está autenticado y trata de entrar al login
      if (isAuthenticated) {
        const role = user?.rol;
        console.log('AuthGuard - role:', role);
        // Si usuario autenticado cliente intenta ir al login de cliente
        if (currentUrl.startsWith('/auth/login') && role === 'Cliente') {
          router.navigate(['/home']);
          return false;
        }

        // Si usuario autenticado admin intenta ir al login de admin
        if (currentUrl.startsWith('/auth-admin/login') && role === 'Administrador') {
          router.navigate(['/admin/dashboard/home']);
          return false;
        }
      }

      // 3. Validar acceso por rol
      if (requiredRole) {
        const userRole = user?.rol;

        if (Array.isArray(requiredRole)) {
          if (!requiredRole.includes(userRole)) {
            router.navigate(['/unauthorized']);
            return false;
          }
        } else {
          if (userRole !== requiredRole) {
            router.navigate(['/unauthorized']);
            return false;
          }
        }
      }

      return true; // acceso permitido
    })
  );
};
