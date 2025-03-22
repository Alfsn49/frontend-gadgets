import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../data-access/auth/auth.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastrService = inject(ToastrService);
  const router = inject(Router)
  console.log(authService.isLoggedIn)
  if(authService.isLoggedIn){
    return true;
  }else{
    toastrService.info('Debes iniciar sesión para acceder a esta página', 'Login requerido');
    router.navigate(['/auth/login']);
    return false;
  }

};
