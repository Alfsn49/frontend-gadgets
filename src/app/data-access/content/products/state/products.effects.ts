import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductsService } from '../../products.service';
import { loadProducts, loadProductsSuccess, loadProductsFailure } from './products.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ProductsEffects {
  constructor(private actions$: Actions, private productsService: ProductsService) {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts), // Escucha cuando se despacha `loadProducts`
      mergeMap(() =>
        this.productsService.getProducts(1).pipe( // Llama al servicio para obtener productos
          map((products) => loadProductsSuccess({ products })), // Despacha `loadProductsSuccess` si tiene éxito
          catchError((error) => of(loadProductsFailure({ error: error.message }))) // Despacha `loadProductsFailure` en caso de error
        )
      )
    )
  );
}
