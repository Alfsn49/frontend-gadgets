import { createAction, props } from "@ngrx/store";

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ page: number; limit: number;filters?: any }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{
    products: any[];
    total: number;
    page: number;
    totalPages: number;
  }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);
  
  export const changePage = createAction(
    '[Products] Change Page',
    props<{ page: number }>()
  );
  
  export const setFilters = createAction(
    '[Products] Set Filters',
    props<{ categoryId: number | null; subCategoryId: number | null; brandId: number | null }>()
  );