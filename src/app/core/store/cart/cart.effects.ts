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
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CartEffects {
  constructor(
    private actions$: Actions,
    private cartService: CartService,
    private toastr: ToastrService, // Asegúrate de importar ToastrService si lo necesitas
  ) {}

 loadCart$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadCart),
    mergeMap(() => {
      const localData = this.cartService.loadCartFromLocalStorage();

      if (
        localData &&
        localData.items &&
        localData.items.length > 0 &&
        !localData.completed
      ) {
        return of(loadCartSuccess({ cart: localData }));
      } else {
        return this.cartService.getCart().pipe(
          map((response) => {
            console.log('Respuesta del backend:', response);
            const cartResponse = response || {
              id: null,
              user_id: null,
              total: 0,
              completed: true,
              items: [],
            };
            this.cartService.saveCartToLocalStorage(cartResponse);
            return loadCartSuccess({ cart: cartResponse });
          }),
          catchError((error) => {
            console.error('Error al cargar el carrito:', error);
            if (error?.status === 404) {
              
              // Retornar una acción para indicar que no hay carrito
              return of(loadCartSuccess({ cart: { id: null, user_id: null, total: 0, completed: true, items: [] } }));
            }
            return of(loadCartFailure({ error }));
          }),
        );
      }
    }),
  ),
);


  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCart),
      mergeMap(({ product_id, quantity }) => {
        const currentCart = this.cartService.loadCartFromLocalStorage();
      
        return this.cartService.updateCartItem({ product_id, quantity }).pipe(
          tap((cart) => {
  this.cartService.saveCartToLocalStorage(cart);
  this.toastr.success('Producto agregado al carrito', 'Éxito');
}),
          map((cart) => 
            
            addToCartSuccess({ cart })),
          catchError((error) => {
            console.log('Error al agregar al carrito:', error);
            this.toastr.error(error.error.message, 'Error');
            // Restaurar el carrito actual en caso de error
            this.cartService.saveCartToLocalStorage(currentCart);
            return of(addToCartFailure({ error }));
          }),
        );
      }),
    ),
  );

  reduceToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reduceCartItem),
      mergeMap(({ product_id, quantity }) => {
        const currentCart = this.cartService.loadCartFromLocalStorage();

        return this.cartService.updateCartItem({ product_id, quantity }).pipe(
          tap((cart) => {
            this.cartService.saveCartToLocalStorage(cart);
          }),
          map((cart) => reduceCartItemSuccess({ cart })),
          catchError((error) => {
            this.cartService.saveCartToLocalStorage(currentCart);
            return of(reduceCartItemFailure({ error }));
          }),
        );
      }),
    ),
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
        const currentCart = this.cartService.loadCartFromLocalStorage();

        return this.cartService.removeProduct(product_id).pipe(
          tap((updatedCart) => {
            this.toastr.success('Producto eliminado del carrito', 'Éxito');
            this.cartService.saveCartToLocalStorage(updatedCart);
          }),
          map((updatedCart) => removeCartItemSuccess({ cart: updatedCart })),
          catchError((error) => {
            this.toastr.error('Error al eliminar el producto del carrito', 'Error');
            this.cartService.saveCartToLocalStorage(currentCart);
            return of(removeCartItemFailure({ error }));
          }),
        );
      }),
    ),
  );
}
