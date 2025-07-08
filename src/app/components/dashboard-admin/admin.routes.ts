import { Routes } from "@angular/router";
import { rolesGuard } from "../../guards/roles.guard";

export const ADMIN_ROUTES:Routes = [{
    path: 'dashboard',
    loadComponent:()=> import('./dashboard-admin.component').then((m)=>m.DashboardAdminComponent),
    
    children:[
        // 👉 Redirección por defecto
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
        {
            path:'home',
            loadComponent:()=> import('./home/home.component').then((m)=>m.HomeComponent),
        },
        {
            path: 'products',
            loadComponent:()=> import('./products/products.component').then((m)=>m.ProductsComponent),
        },
        {
            path: 'categories',
            loadComponent:()=> import('./categories/categories.component').then((m)=>m.CategoriesComponent),
        },{
            path:'brands',
            loadComponent:()=> import('./brand/brand.component').then((m)=>m.BrandComponent),
        },
        {
            path:'sub-categories',
            loadComponent:()=> import('./sub-categories/sub-categories.component').then((m)=>m.SubCategoriesComponent),
        },
        {
            path:'set',
            loadComponent:()=> import('./set/set.component').then((m)=>m.SetComponent),
        },{
            path:'roles',
            loadComponent:()=> import('./rols/rols.component').then((m)=>m.RolsComponent),
        },{
            path:'orders',
            loadComponent:()=> import('./orders/orders.component').then((m)=>m.OrdersComponent),
        },{
            path:'clients',
            loadComponent:()=> import('./clients/clients.component').then((m)=>m.ClientsComponent),
        },{
           path:"reportaje",
           loadComponent:()=> import('./reports/reports.component').then((m)=>m.ReportsComponent) 
        }
    ]
}]