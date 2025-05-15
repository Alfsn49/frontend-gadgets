import { Routes } from "@angular/router";

export const ADMIN_ROUTES:Routes = [{
    path: 'dashboard',
    loadComponent:()=> import('./dashboard-admin.component').then((m)=>m.DashboardAdminComponent),
    children:[
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
        }
    ]
}]