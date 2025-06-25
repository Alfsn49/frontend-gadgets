import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { authGuard } from './core/guards/auth.guard';
import { rolesGuard } from './guards/roles.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard-client/dashboard-client.component').then((m) => m.DashboardClientComponent),
    children:[
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./components/dashboard-client/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'auth/login',
        loadComponent: () =>
          import('./components/dashboard-client/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'auth/signup',
        loadComponent: () =>
          import('./components/dashboard-client/auth/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/dashboard-client/products/features/product-list/product-list.component').then(
            (m) => m.ProductListComponent)
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./components/dashboard-client/products/features/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent)
      },{
        path: 'cart',
        data:{
          roles: ['Cliente'] // Solo los clientes pueden acceder al carrito
        },
        canActivate: [authGuard, rolesGuard],
        loadChildren:()=> import('./components/dashboard-client/cart/cart.routes')
        },
        {
          path: 'profile',
          data:{
            roles: ['Cliente'] // Solo los clientes pueden acceder al perfil
          },
          canActivate: [authGuard, rolesGuard],
          loadComponent:()=> import('./components/dashboard-client/client/profile/profile.component').then(m=>m.ProfileComponent)
        },{
          path: 'address',
          data:{
            roles: ['Cliente'] // Solo los clientes pueden acceder a la dirección
          },
          canActivate: [authGuard, rolesGuard],
          loadComponent:()=> import('./components/dashboard-client/client/address/address.component').then(m=>m.AddressComponent)
        },{
          path:'forget-password',
          loadComponent:()=> import('./components/dashboard-client/auth/forget-password/forget-password.component').then(m=>m.ForgetPasswordComponent)
        },
        {
          path:'reset-password',
          loadComponent:()=> import('./components/dashboard-client/auth/password-reset/password-reset.component').then(m=>m.PasswordResetComponent)
        },
        {
          path:'categoria',
          loadComponent:()=> import('./components/dashboard-client/categoria/categoria.component').then(m=>m.CategoriaComponent)
        },
        {
          path:'about',
          loadComponent:()=> import('./components/dashboard-client/about/about.component').then(m=>m.AboutComponent)
        },{
          path:'success',
          loadComponent:()=> import('./components/success/success.component').then(m=>m.SuccessComponent)
        },{
          path:'cancel',
          loadComponent:()=> import('./components/dashboard-client/cancel/cancel.component').then(m=>m.CancelComponent)
        }
    ]
  },{
    path:'auth-admin/login',
    canActivate: [authGuard],
    loadComponent:()=> import('./components/dashboard-admin/auth/login/login.component').then(m=>m.LoginComponent),
  },{
    path: 'admin',
    canActivate:[
        rolesGuard
    ],
    data:{
      roles: ['Administrador'] 
    },
    loadChildren: () =>
      import('./components/dashboard-admin/admin.routes').then(
        (m) => m.ADMIN_ROUTES
      ),
  },
    { path: '**', loadComponent:() => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
    }, // Ruta 404 (debe ir al final SIEMPRE)
];
