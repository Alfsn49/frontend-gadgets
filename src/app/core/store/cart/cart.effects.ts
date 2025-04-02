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

// // Ejemplo completo de effect corregido
// removeItem$ = createEffect(() =>
//   this.actions$.pipe(
//     ofType(removeCartItem),
//     mergeMap(({ data }) => {
//       const localData = this.cartService.loadCartFromLocalStorage();
//       const updatedProducts = localData.products.filter(item => item.product.id !== data.product_id);
      
//       this.cartService.saveCartToLocalStorage({
//         cart: localData.cart,
//         products: updatedProducts
//       });

//       return this.cartService.removeProduct(data.product_id).pipe(
//         switchMap(() => this.cartService.getCart()),
//         map(fullResponse => removeCartItemSuccess({
//           cart: fullResponse.cart,
//           products: fullResponse.products
//         })),
//         catchError(error => {
//           this.cartService.saveCartToLocalStorage(localData);
//           return of(removeCartItemFailure({ error }));
//         })
//       );
//     })
//   )
// );
}
