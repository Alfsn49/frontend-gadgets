import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartService } from '../../../data-access/cart/cart.service';
import {
  loadCart,
  loadCartFailure,
  loadCartSuccess,
  addToCart,
  addToCartFailure,
  addToCartSuccess,
  updateCartItem,
  updateCartItemFailure,
  updateCartItemSuccess,
  removeCartItem,
  removeCartItemFailure,
  removeCartItemSuccess,
  reduceCartItem,
  reduceCartItemSuccess,
  reduceCartItemFailure,
} from './cart.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';

@Injectable()
export class CartEffects {
  constructor(
    private actions$: Actions,
    private cartService: CartService,
  ) {}

  // Cargar carrito
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCart),
      mergeMap(() => {
        const localData = this.cartService.loadCartFromLocalStorage();
        
        if (localData.items.length > 0) {
          return of(loadCartSuccess({ data: localData }));
        } else {
          return this.cartService.getCart().pipe(
            tap(response => {
              this.cartService.saveCartToLocalStorage(response);
            }),
            map(response => loadCartSuccess({ data: response })),
            catchError(error => of(loadCartFailure({ error })))
          );
        }
      })
    )
  );
  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCart),
      mergeMap(({ product_id, quantity }) => {
        const currentCart = this.cartService.loadCartFromLocalStorage();
        
        return this.cartService.updateCartItem({product_id, quantity}).pipe(
          switchMap(() => this.cartService.getCart()),
          tap(cart => {
            this.cartService.saveCartToLocalStorage(cart);
          }),
          map(cart => addToCartSuccess({ cart })),
          catchError(error => {
            this.cartService.saveCartToLocalStorage(currentCart);
            return of(addToCartFailure({ error }));
          })
        );
      })
    )
  );

  reduceToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reduceCartItem),
      mergeMap(({ product_id, quantity }) => {
        const currentCart = this.cartService.loadCartFromLocalStorage();
        
        return this.cartService.updateCartItem({product_id, quantity}).pipe(
          switchMap(() => this.cartService.getCart()),
          tap(cart => {
            this.cartService.saveCartToLocalStorage(cart);
          }),
          map(cart => reduceCartItemSuccess({ cart })),
          catchError(error => {
            this.cartService.saveCartToLocalStorage(currentCart);
            return of(reduceCartItemFailure({ error }));
          })
        );
      })
    )
  );
  
//   reduceCartItem$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(reduceCartItem),
//       mergeMap(({ productId }) => 
//         this.cartService.updateCartItem(productId).pipe(
//           switchMap(() => this.cartService.getCart()),
//           tap(fullResponse => {
//             this.cartService.saveCartToLocalStorage(fullResponse);
//           }),
//           map(fullResponse => reduceCartItemSuccess({
//             cart: fullResponse.cart,
//             products: fullResponse.products
//           })),
//           catchError(error => of(reduceCartItemFailure({ error })))
//         )
//       )
//     )
//   );

removeItem$ = createEffect(() =>
  this.actions$.pipe(
    ofType(removeCartItem),
    mergeMap(({ product_id }) => {
      // Guardamos el carrito actual por si hay error
      const currentCart = this.cartService.loadCartFromLocalStorage();
      
      return this.cartService.removeProduct(product_id).pipe(
        switchMap(() => this.cartService.getCart()),
        tap(updatedCart => {
          // Guardamos el nuevo carrito en localStorage
          this.cartService.saveCartToLocalStorage(updatedCart);
        }),
        map(updatedCart => removeCartItemSuccess({ cart: updatedCart })),
        catchError(error => {
          // Restauramos el carrito anterior si hay error
          this.cartService.saveCartToLocalStorage(currentCart);
          return of(removeCartItemFailure({ error }));
        })
      );
    })
  )
);
}
