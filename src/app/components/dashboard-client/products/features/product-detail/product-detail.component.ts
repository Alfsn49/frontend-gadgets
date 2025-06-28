import { Component, effect, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsDetailStateService } from '../../../../../data-access/content/products-detail-state.service';
import { CurrencyPipe } from '@angular/common';
import { CartStateService } from '../../../../../data-access/cart/cart-state.service';
import { ProductsService } from '../../../../../data-access/content/products.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { addToCart } from '../../../../../core/store/cart/cart.actions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  productDetailState = inject(ProductsDetailStateService).state;
  productService = inject(ProductsService)
  id = input.required<string>();
  cartState= inject(CartStateService).state;
  products:any = "";
  toastr = inject(ToastrService);
  isAuthenticated$: Observable<boolean>;
  
    isAuthenticated: boolean = false;
    store = inject(Store);
  
  constructor(){
    this.isAuthenticated$ = this.store.select(state => state.auth.isAuthenticated);
    this.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      console.log('isAuthenticated:', this.isAuthenticated);
    });
    effect(()=>{
      console.log(this.id())
      this.getProduct(this.id());
      this.productDetailState.getById(this.id());
    })
    
  }
  getProduct(id:string){
    this.productService.getProductId(id).subscribe({
      next:(data)=>{
        console.log(data)
        this.products = data;
      }
    })
  }
  addToCart($event: Event) {
    if(this.isAuthenticated != null){
      console.log("funciona")

      const cartItem ={
        product_id: this.products.id,  // Accedemos al ID a través de product.product
      quantity: 1                     // Cantidad a añadir
      }
      this.store.dispatch(addToCart({ product_id: cartItem.product_id, quantity: cartItem.quantity }));
    }else{
      this.toastr.info('Debes iniciar sesión para agregar productos al carrito', 'Login requerido');
    }

  }
}
