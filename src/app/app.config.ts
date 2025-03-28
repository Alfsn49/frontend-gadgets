import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { refreshInterceptor } from './interceptors/refresh.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AuthEffects } from './core/store/auth/auth.effects';
import { authReducer } from './core/store/auth/auth.reducer';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { productReducer } from './data-access/content/products/state/products.reducer';
import { ProductsEffects } from './data-access/content/products/state/products.effects';
import { cartReducer } from './core/store/cart/cart.reducer';
import { CartEffects } from './core/store/cart/cart.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([refreshInterceptor])),
    provideAnimations(),
    provideToastr(), provideAnimationsAsync(),
    provideStore({
      auth: authReducer,
      products: productReducer,
      cart: cartReducer
    }),
    provideEffects(AuthEffects, ProductsEffects, CartEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    importProvidersFrom(
      [BrowserAnimationsModule]
    )
],
};
