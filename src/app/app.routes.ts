import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./components/auth/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/features/product-list/product-list.component').then(
        (m) => m.ProductListComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/products/features/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent)
  },{
    path: 'cart',
    canActivate: [authGuard],
    loadChildren:()=> import('./components/cart/cart.routes')
    },
    {
      path: 'profile',
      canActivate: [authGuard],
      loadComponent:()=> import('./components/client/profile/profile.component').then(m=>m.ProfileComponent)
    },{
      path: 'address',
      loadComponent:()=> import('./components/client/address/address.component').then(m=>m.AddressComponent)
    },{
      path:'forget-password',
      loadComponent:()=> import('./components/auth/forget-password/forget-password.component').then(m=>m.ForgetPasswordComponent)
    },
    {
      path:'reset-password',
      loadComponent:()=> import('./components/auth/password-reset/password-reset.component').then(m=>m.PasswordResetComponent)
    },
    {
      path:'categoria',
      loadComponent:()=> import('./components/categoria/categoria.component').then(m=>m.CategoriaComponent)
    },
    {
      path:'about',
      loadComponent:()=> import('./components/about/about.component').then(m=>m.AboutComponent)
    },{
      path:'success',
      loadComponent:()=> import('./components/success/success.component').then(m=>m.SuccessComponent)
    },{
      path:'cancel',
      loadComponent:()=> import('./components/cancel/cancel.component').then(m=>m.CancelComponent)
    },
    { path: '**', loadComponent:() => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
    }, // Ruta 404 (debe ir al final SIEMPRE)
];
