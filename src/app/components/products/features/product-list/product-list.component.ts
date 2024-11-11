import { Component, inject } from '@angular/core';
import { ProductsStateService } from '../../../../data-access/content/products-state.service';
import { ProductCardComponent } from '../../ui/product-card/product-card.component';
import { CartStateService } from '../../../../data-access/cart/cart-state.service';
import { Product } from '../../../../Dto/Product.dto';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products= inject(ProductsStateService)
  cartState= inject(CartStateService).state;
  constructor(){}

  changePage(){
    const page = this.products.state.page() + 1;
    this.products.changePageS.next(page);
  }
  addToCart(product:any){
    console.log(product)
    this.cartState.add({
      product,
      quantity: 1
    })
  }
}
