import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../data-access/auth/auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Si el usuario está logueado, redirigir al dashboard/home
  if (authService.isLoggedIn) {
    // Puedes redirigir a diferentes lugares según el tipo de usuario
    router.navigate(['/']); // o '/home', '/products', etc.
    return false; // No permitir acceso a la ruta de autenticación
  }
  
  return true; // Permitir acceso (usuario no está logueado)
};
