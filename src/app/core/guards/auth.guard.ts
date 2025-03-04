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
  return store.select(state => state.auth.isAuthenticated).pipe(
    map(isAuthenticated  =>{
      if (isAuthenticated) {
        return true; // Permitir el acceso a la ruta
      } else {
        router.navigate(['/auth/login']); // Redirigir a la página de login
        return false; // Denegar el acceso a la ruta
      }
    })
  )
};
