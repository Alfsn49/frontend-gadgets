import { Injectable, inject } from '@angular/core';
import { signalSlice } from 'ngxtension/signal-slice';
import { catchError, map, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { ProductsService } from './products.service';

interface State{
  product: any | null;
  status: 'loading' | 'success' | 'error';
  
}
@Injectable({
  providedIn: 'root'
})
export class ProductsDetailStateService {
  private productService = inject(ProductsService);
  constructor() { }
  private initialState:State ={
    product:null,
    status: 'loading' as const,
  };

  state=signalSlice({
    initialState: this.initialState,
    actionSources:{
      getById:(_state, $: Observable<string>)=>$.pipe(
        switchMap((id)=>this.productService.getProductId(id)),
        map((data)=>({product:data, status: 'success' as const}),
      ))
    }
  })
}
