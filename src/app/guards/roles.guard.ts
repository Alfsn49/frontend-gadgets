import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRole } from '../core/store/auth/auth.selectors';
import { map, take } from 'rxjs/operators';

export const rolesGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const allowedRoles = ['Administrador', 'Cliente'];
  
  // Obtener la URL actual
  const currentUrl = state.url;
  const isAdminRoute = currentUrl.includes('/admin/') || currentUrl.includes('/admin-');

  return store.select(selectRole).pipe(
    take(1),
    map((role) => {
      console.log('role', role);
      console.log('currentUrl', currentUrl);
      
      // 1. Si role es null/undefined (token expirado o no autenticado)
      if (!role) {
        // Redirigir según la ruta actual
        if (isAdminRoute) {
          console.log('Redirigiendo a admin/login (ruta admin sin rol)');
          router.navigate(['/admin/login'], { 
            queryParams: { sessionExpired: true } 
          });
        } else {
          console.log('Redirigiendo a auth/login (ruta cliente sin rol)');
          router.navigate(['/auth/login'], { 
            queryParams: { sessionExpired: true } 
          });
        }
        return false;
      }
      
      // 2. Si tiene rol pero no está en los permitidos
      if (!allowedRoles.includes(role)) {
        console.log('Rol no permitido:', role);
        
        // Redirigir según el rol que tiene (aunque no sea válido)
        if (role.toLowerCase().includes('admin')) {
          router.navigate(['/admin/login']);
        } else {
          router.navigate(['/auth/login']);
        }
        return false;
      }
      
      // 3. Si tiene rol válido, verificar acceso por ruta
      if (role === 'Cliente' && isAdminRoute) {
        console.log('Cliente intentando acceder a ruta admin');
        router.navigate(['/unauthorized']); // o a /home
        return false;
      }
      
      if (role === 'Administrador' && !isAdminRoute && 
          !currentUrl.startsWith('/auth/login') &&
          !currentUrl.includes('/admin/')) {
        // Si admin accede a ruta de cliente, puede ser permitido o no
        // Depende de tu lógica de negocio
        console.log('Admin accediendo a ruta cliente');
        // return true; // Permitir o redirigir
      }
      
      // 4. Acceso permitido
      return true;
    })
  );
};