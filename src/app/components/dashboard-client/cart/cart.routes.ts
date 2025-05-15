import { Routes } from "@angular/router";

export default[
    {
        path:'',
        loadComponent:()=>import('./cart.component').then(m=>m.CartComponent)
    }
]as Routes