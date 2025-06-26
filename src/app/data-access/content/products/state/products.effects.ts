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
      ofType(loadProducts),
      mergeMap(({ page, limit,filters }) =>
        this.productsService.getProducts(page, limit,filters).pipe(
          map((response) =>
            loadProductsSuccess({
              products: response.products,
              total: response.total,
              page: response.page,
              totalPages: response.totalPages,
            })
          ),
          catchError(error => {
          if (error.error.statusCode === 404) {
            return of(loadProductsSuccess({ products: [], total: 0, page: 1, totalPages: 0 }));
          }
          return of(loadProductsFailure({ error }));
        })
        )
      )
    )
  );
  
}
