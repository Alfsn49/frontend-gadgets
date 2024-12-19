import { inject, Injectable, Signal } from '@angular/core';
import { signalSlice } from 'ngxtension/signal-slice';
import { StorageService } from '../storage/storage.service';
import { CartService } from './cart.service';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { ProductItemCart } from '../../Dto/Product.dto';
import { AuthService } from '../auth/auth.service';

interface State {
  products: ProductItemCart[];
  status: 'loading' | 'success' | 'error';
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CartStateService {
  constructor() {
    if(this.authService.isLoggedIn){

    }else{
      
    }
  }

  private _storageService = inject(StorageService);
  private cartService = inject(CartService);
  private authService= inject(AuthService);
  
  private initialState: State = {
    products: [],
    status: 'loading' as const,
    loaded: false,
  };
  private loadCartProducts(): Observable<State> {
    if(this.authService.isLoggedIn){
      return this.cartService.getCart().pipe(map((response) => ({ products: response.products, loaded: true, status:'success' })));
    }else{
      return of ({ products: [], loaded: false, status:'error' })
    }
  }
  loadProducts$ = this.cartService
    .getCart()
    .pipe(map((response) => ({ products: response.products, loaded: true })));

  state = signalSlice({
    initialState: this.initialState,
    sources: [this.loadCartProducts()],
    selectors:(state)=>({
      count:()=>
        state().products.reduce((acc:any,product:any)=>acc+product.quantity,0),
      price: () =>
        state().products.reduce(
          (acc, product) => acc + product.product.price * product.quantity,
          0,
        ),
    }),
    actionSources: {
      add: (state, $: Observable<ProductItemCart>) =>
        $.pipe(
          switchMap((product) => {
            const payload = { product_id: product.product.id, quantity: 1 };
      
            return this.syncCartWithServer([payload]).pipe(
              map(() => {
                // Solo actualizar el estado si la sincronización fue exitosa
                const isInCart = state().products.find(
                  (item) => item.product.id === product.product.id,
                );
      
                const updateProducts = isInCart
                  ? state().products.map((item) => {
                      if (item.product.id === product.product.id) {
                        return { ...item, quantity: item.quantity + 1 };
                      }
                      return item;
                    })
                  : [...state().products, { ...product, quantity: 1 }];
      
                return { products: updateProducts };
              }),
              catchError((error) => {
                console.error('No se pudo agregar el producto al carrito:', error);
                return of(state()); // Retornar el estado actual sin cambios
              }),
            );
          }),
        ),
        remove: (state, $: Observable<number>) =>
          $.pipe(
            switchMap((product) => {
              return this.syncCartWithStorage(product).pipe(
                map(() => {
                  // Actualizar el estado eliminando el producto del carrito
                  const updatedProducts = state().products.filter(
                    (item) => item.product.id !== product
                  );
        
                  return { products: updatedProducts };
                }),
                catchError((error) => {
                  console.error('Error al eliminar el producto del carrito:', error);
                  return of(state()); // Retornar el estado actual sin cambios en caso de error
                })
              );
            })
          ),
      update:(state,$:Observable<ProductItemCart>)=>$.pipe(
        switchMap((product)=>{
          console.log(product)
          const payload = { product_id: product.product.id, quantity: product.quantity };
          console.log(payload)
          return this.syncCartWithServer([payload]).pipe(
            map(() => {
              // Actualizar el estado sumando o restando la cantidad especificada
              const updatedProducts = state().products.map((item) => {
                if (item.product.id === product.product.id) {
                  return { ...item, quantity: item.quantity + product.quantity };
                }
                return item;
              });
    
              return { products: updatedProducts };
            }),
          )
        })
      )
    },
    
  });

  private syncCartWithServer(products: any): Observable<any> {
    return from(products).pipe(
      switchMap((item: any) => {
        const payload = {
          product_id: item.product_id,
          quantity: item.quantity,
        };
        return this.cartService.updateCartItem(payload).pipe(
          map((response) => {
            console.log(`Producto ${item.product_id} sincronizado con el servidor:`, response);
            return response;
          }),
          catchError((error) => {
            console.error(`Error al sincronizar el producto ${item.product_id}:`, error);
            return of(null); // Continúa en caso de error sin detener todo
          })
        );
      })
    );
  }
  
  private syncCartWithStorage(productId: number): Observable<any> {
    return this.cartService.removeProduct(productId).pipe(
      map((response) => {
        console.log('Producto eliminado del servidor', response);
        return response;
      }),
      catchError((error) => {
        console.error('Error al eliminar el producto del servidor:', error);
        return of(null);
      })
    );
  }
  
}
