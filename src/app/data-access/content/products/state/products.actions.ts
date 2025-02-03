import { createAction, props } from "@ngrx/store";

export const loadProduct = createAction('[Products] Load Products');
export const loadProductsSuccess = createAction(
    '[Products] Load Products Success',
    props<{ products: any }>()
);