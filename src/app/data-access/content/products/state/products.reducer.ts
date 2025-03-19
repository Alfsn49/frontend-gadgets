// src/app/state/products.reducer.ts

import { createReducer, on } from '@ngrx/store';
import { loadProductsSuccess, loadProductsFailure, changePage, setFilters } from './products.actions';


export interface ProductState {
  products: any[];
  status: 'loading' | 'success' | 'error';
  page: number;
  selectedCategory: number | null;
  selectedSubCategory: number | null;
  selectedBrand: number | null;
}

export const initialState: ProductState = {
  products: [],
  status: 'loading',
  page: 1,
  selectedCategory: null,
  selectedSubCategory: null,
  selectedBrand: null,
};

export const productReducer = createReducer(
  initialState,
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    status: 'success' as 'success',
  })),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    status: 'error' as 'error',
  })),
  on(changePage, (state, { page }) => ({
    ...state,
    page,
  })),
  on(setFilters, (state, { categoryId, subCategoryId, brandId }) => ({
    ...state,
    selectedCategory: categoryId,
    selectedSubCategory: subCategoryId,
    selectedBrand: brandId,
  }))
);
