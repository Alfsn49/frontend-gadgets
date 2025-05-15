import { Component, effect, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsDetailStateService } from '../../../../../data-access/content/products-detail-state.service';
import { CurrencyPipe } from '@angular/common';
import { CartStateService } from '../../../../../data-access/cart/cart-state.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  productDetailState = inject(ProductsDetailStateService).state;
  id = input.required<string>();
  cartState= inject(CartStateService).state;
  constructor(){
    effect(()=>{
      console.log(this.id())
      this.productDetailState.getById(this.id());
    })
  }

  addToCart(){
    
    this.cartState.add({
      product:this.productDetailState.product()!,
      quantity: 1
    })
  }
}
