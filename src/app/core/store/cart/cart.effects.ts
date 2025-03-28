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
} from './cart.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';

@Injectable()
export class CartEffects {
  constructor(
    private actions$: Actions,
    private cartService: CartService,
  ) {}

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCart),
      mergeMap(() => {
        const localCart = this.cartService.loadCartFromLocalStorage();
        if (localCart.length > 0) {
          return of(loadCartSuccess({ data: localCart }));
        } else {
          return this.cartService.getCart().pipe(
            map((response) => 
                {
                    console.log(response)
                    localStorage.setItem('cart', JSON.stringify(response.products));
                    return  loadCartSuccess({ data: response.products })
                }),
            catchError((error) =>
              of(loadCartFailure({ error: 'Error al cargar el carrito' })),
            ),
          );
        }
      }),
    ),
  );
}
