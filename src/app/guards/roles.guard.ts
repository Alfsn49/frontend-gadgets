import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRole } from '../core/store/auth/auth.selectors';
import { map, take } from 'rxjs';

export const rolesGuard: CanActivateFn = (route, state) => {
  const store = inject(Store)
  const router = inject(Router)
  const allowedRoles = ['Administrador', 'Cliente']; // Define los roles permitidos

  return store.select(selectRole).pipe(
    take(1),
    map((role)=>{
      console.log('role', role);
      if(allowedRoles.includes(role)){
        return true;
      }else{
        router.navigate(['/']);
        return false;
      }
    })
  );
};
