import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CartService } from "../../../data-access/cart/cart.service";
import { loadCart, loadCartFailure, loadCartSuccess, addToCart, addToCartFailure, addToCartSuccess, updateCartItem, updateCartItemFailure, updateCartItemSuccess, removeCartItem, removeCartItemFailure, removeCartItemSuccess } from "./cart.actions";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";