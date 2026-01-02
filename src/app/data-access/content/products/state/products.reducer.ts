// src/app/state/products.reducer.ts

import { createReducer, on } from '@ngrx/store';
import { loadProducts,loadProductsSuccess, loadProductsFailure, changePage, setFilters } from './products.actions';


export interface ProductState {
  products: any[];
  total: number;
  status: 'loading' | 'success' | 'error' | 'idle';
  totalPages: number;
  page: number;
  selectedCategory: number | null;
  selectedSubCategory: number | null;
  selectedBrand: number | null;
}

export const initialState: ProductState = {
  products: [],
  total: 0,
  status: 'idle',
  page: 1,
  totalPages: 1,
  selectedCategory: null,
  selectedSubCategory: null,
  selectedBrand: null,
};

export const productReducer = createReducer(
  initialState,
  on(loadProducts, (state) => ({
    ...state,
    status: 'loading' as const
  })),
  on(loadProductsSuccess, (state, { products, total, page, totalPages }) => ({
    ...state,
    products,
    total,
    page,
    totalPages,
    status: 'success' as const,
  })),
   on(loadProductsFailure, (state) => ({
    ...state,
    products: [],
    total: 0,
    totalPages: 0,
    page: 1,
    selectedCategory: null,
    selectedSubCategory: null,
    selectedBrand: null,
    status: 'error' as const,
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
