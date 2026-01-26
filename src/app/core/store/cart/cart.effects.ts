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
  clearCart,
  refreshCart,
  cartCompleted
} from './cart.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CartEffects {
  constructor(
    private actions$: Actions,
    private cartService: CartService,
    private toastr: ToastrService,
  ) {}

   /** 🛒 Cargar carrito - MODIFICADO */
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCart, refreshCart), // 👈 También responde a refreshCart
      mergeMap(() => {
        const localData = this.cartService.loadCartFromLocalStorage();

        // ✅ VERIFICAR SI EL CARRITO ESTÁ COMPLETADO
        if (localData?.completed) {
          // Si el carrito en localStorage está completado, forzar recarga del backend
          console.log('🔄 Carrito completado en localStorage, forzando recarga del backend');
          this.cartService.clearCartFromLocalStorage(); // Limpiar localStorage
          return this.loadFromBackend();
        }

        if (
          localData &&
          localData.items &&
          localData.items.length > 0 &&
          !localData.completed
        ) {
          console.log("📦 Usando carrito de localStorage:", localData);
          return of(loadCartSuccess({ cart: localData }));
        } else {
          // Cargar del backend
          return this.loadFromBackend();
        }
      }),
    ),
  );

  /** 🔄 Método privado para cargar desde backend */
  private loadFromBackend() {
    return this.cartService.getCart().pipe(
      map((response) => {
        console.log('🧾 Respuesta del backend:', response);
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
        console.error('❌ Error al cargar el carrito:', error);
        if (error?.status === 404) {
          return of(
            loadCartSuccess({
              cart: {
                id: null,
                user_id: null,
                total: 0,
                completed: true,
                items: [],
              },
            }),
          );
        }
        return of(loadCartFailure({ error }));
      }),
    );
  }

  /** 🆑 Limpiar carrito (ej: después de compra) */
  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clearCart, cartCompleted), // 👈 También para cartCompleted
      tap(() => {
        console.log('🗑️ Limpiando carrito del localStorage');
        this.cartService.clearCartFromLocalStorage();
      }),
      mergeMap(() => {
        // Después de limpiar, cargar un carrito nuevo del backend
        return this.cartService.getCart().pipe(
          map((cart) => loadCartSuccess({ cart })),
          catchError((error) => of(loadCartFailure({ error })))
        );
      })
    )
  );


  /** ➕ Agregar producto al carrito */
  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCart),
      mergeMap(({ product_id, quantity }) => {
        const currentCart =
          this.cartService.loadCartFromLocalStorage() || { items: [] };

        return this.cartService.updateCartItem({ product_id, quantity }).pipe(
          tap((cart) => {
            this.cartService.saveCartToLocalStorage(cart);
            this.toastr.success('Producto agregado al carrito', 'Éxito');
          }),
          map((cart) => addToCartSuccess({ cart })),
          catchError((error) => {
            console.error('❌ Error al agregar al carrito:', error);
            this.toastr.error(
              error?.error?.message || 'Error al agregar producto',
              'Error',
            );
            // Restaurar el carrito anterior
            this.cartService.saveCartToLocalStorage(currentCart);
            return of(addToCartFailure({ error }));
          }),
        );
      }),
    ),
  );

  /** ➖ Reducir cantidad de producto */
  reduceToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reduceCartItem),
      mergeMap(({ product_id, quantity }) => {
        const currentCart =
          this.cartService.loadCartFromLocalStorage() || { items: [] };

        return this.cartService.updateCartItem({ product_id, quantity }).pipe(
          tap((cart) => {
            this.cartService.saveCartToLocalStorage(cart);
          }),
          map((cart) => reduceCartItemSuccess({ cart })),
          catchError((error) => {
            console.error('❌ Error al reducir cantidad:', error);
            this.toastr.error(
              error?.error?.message || 'Error al actualizar el carrito',
              'Error',
            );
            this.cartService.saveCartToLocalStorage(currentCart);
            return of(reduceCartItemFailure({ error }));
          }),
        );
      }),
    ),
  );

  /** ❌ Eliminar producto del carrito */
  removeItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCartItem),
      mergeMap(({ product_id }) => {
        const currentCart =
          this.cartService.loadCartFromLocalStorage() || { items: [] };

        return this.cartService.removeProduct(product_id).pipe(
          tap((updatedCart) => {
            this.toastr.success('Producto eliminado del carrito', 'Éxito');
            this.cartService.saveCartToLocalStorage(updatedCart);
          }),
          map((updatedCart) => removeCartItemSuccess({ cart: updatedCart })),
          catchError((error) => {
            console.error('❌ Error al eliminar producto:', error);
            this.toastr.error(
              error?.error?.message || 'Error al eliminar producto',
              'Error',
            );
            this.cartService.saveCartToLocalStorage(currentCart);
            return of(removeCartItemFailure({ error }));
          }),
        );
      }),
    ),
  );
}
