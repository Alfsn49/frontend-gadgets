import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { refreshInterceptor } from './interceptors/refresh.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { productReducer } from './data-access/content/products/state/products.reducer';
import { provideEffects } from '@ngrx/effects';
import { ProductsEffects } from './data-access/content/products/state/products.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([refreshInterceptor])),
    provideAnimations(),
    provideToastr(), provideAnimationsAsync(),
    provideStore({ productState: productReducer }),
    provideEffects(ProductsEffects)
],
};
