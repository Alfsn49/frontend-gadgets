import { Component, effect, inject, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductsDetailStateService } from '../../../../../data-access/content/products-detail-state.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartStateService } from '../../../../../data-access/cart/cart-state.service';
import { ProductsService } from '../../../../../data-access/content/products.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { addToCart } from '../../../../../core/store/cart/cart.actions';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  productDetailState = inject(ProductsDetailStateService).state;
  productService = inject(ProductsService)
  router = inject(Router)
  id = input.required<string>();
  cartState = inject(CartStateService).state;
  
  products: any = undefined;
  
  toastr = inject(ToastrService);
  isAuthenticated$: Observable<boolean>;
  quantity: number = 1;
  isAuthenticated: boolean = false;
  store = inject(Store);
  
  // Estados
  isLoading: boolean = true;
  isError: boolean = false;
  isAddingToCart: boolean = false;
  showSuccessAnimation: boolean = false; // Nueva variable para la animación
  successAnimationTimer: any; // Para limpiar el timeout
  
  constructor() {
    this.isAuthenticated$ = this.store.select(state => state.auth.isAuthenticated);
    this.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    
    effect(() => {
      this.getProduct(this.id());
    })
  }
  
  getProduct(id: string) {
    this.isLoading = true;
    this.isError = false;
    
    this.productService.getProductId(id).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isError = true;
        this.isLoading = false;
        this.toastr.error('Error al cargar el producto', 'Error');
      }
    })
  }
  
  increaseQuantity() {
    if (this.products && this.quantity < (this.products.stock || 99)) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityInput() {
    if (this.quantity < 1) this.quantity = 1;
    if (this.products?.stock && this.quantity > this.products.stock)
      this.quantity = this.products.stock;
  }

  addToCart($event: Event) {
    $event.preventDefault();
    
    if (!this.products) return;
    
    if (this.isAuthenticated) {
      this.isAddingToCart = true;
      
      const cartItem = {
        product_id: this.products.id,
        quantity: this.quantity
      };

      this.store.dispatch(addToCart({ 
        product_id: cartItem.product_id, 
        quantity: cartItem.quantity 
      }));

      // Simular carga
      setTimeout(() => {
        this.isAddingToCart = false;
        
        // // Mostrar animación de éxito
        // this.showSuccessAnimation = true;
        
        // // Ocultar automáticamente después de 3 segundos
        // if (this.successAnimationTimer) {
        //   clearTimeout(this.successAnimationTimer);
        // }
        
        // this.successAnimationTimer = setTimeout(() => {
        //   this.showSuccessAnimation = false;
        // }, 3000);
        
        // this.toastr.success(
        //   `Se agregó ${this.quantity} unidad(es) de "${this.products.name}" al carrito`,
        //   '¡Agregado!'
        // );
      }, 500);

    } else {
      this.toastr.info('Debes iniciar sesión para agregar productos al carrito', 'Login requerido');
    }
  }
  
  calculateDiscount(original: number, current: number): number {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  }

  calculateStockPercentage(stock: number): number {
    const maxStock = 100;
    if (!stock || stock <= 0) return 0;
    return Math.min(Math.round((stock / maxStock) * 100), 100);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  buyNow(event: Event): void {
    event.preventDefault();
    if (!this.products) return;
    
    if (this.isAuthenticated) {
      const cartItem = {
        product_id: this.products.id,
        quantity: this.quantity
      };
      this.store.dispatch(addToCart({ product_id: cartItem.product_id, quantity: cartItem.quantity }));
      this.router.navigate(['/checkout']);
    } else {
      this.toastr.info('Debes iniciar sesión para comprar', 'Login requerido');
    }
  }
  
  // Limpiar timeout al destruir el componente
  ngOnDestroy() {
    if (this.successAnimationTimer) {
      clearTimeout(this.successAnimationTimer);
    }
  }
}