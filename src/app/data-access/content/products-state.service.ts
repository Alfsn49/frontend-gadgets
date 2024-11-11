import { Injectable, inject } from '@angular/core';
import { ProductsService } from './products.service';
import { signalSlice } from 'ngxtension/signal-slice';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';

interface State{
  products: any | null;
  status: 'loading' | 'success' | 'error';
  page:number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsStateService {
  private productService = inject(ProductsService);

  private initialState:State ={
    products:[],
    status: 'loading' as const,
    page:1,
  };

  changePageS = new Subject<number>();

  loadProducts$ = this.changePageS.pipe(
    startWith(1),
    switchMap((page)=>this.productService.getProducts(page)),
    map((products)=>({
      products,
      status: 'success' as const
    })),
    catchError(()=>{
      return of({
        products:[],
        status: 'error' as const
      })
    })
  )

  state = signalSlice({
    initialState: this.initialState,
    sources:[
      this.changePageS.pipe(
        map((page)=>({page, status:'loading' as const}))
      ),
      this.loadProducts$
    ],
  })

}
