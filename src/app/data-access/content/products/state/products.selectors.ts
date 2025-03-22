// src/app/state/products.selectors.ts

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './products.reducer';

export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectAllProducts = createSelector(
  selectProductState,
  (state) => state?.products
);

export const selectProductStatus = createSelector(
  selectProductState,
  (state) => state?.status
);

export const selectPage = createSelector(
  selectProductState,
  (state) => state?.page
);

export const selectFilters = createSelector(
  selectProductState,
  (state) => ({
    categoryId: state?.selectedCategory,
    subCategoryId: state?.selectedSubCategory,
    brandId: state?.selectedBrand,
  })
);
