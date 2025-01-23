import { Component, inject } from '@angular/core';
import { ProductsStateService } from '../../../../data-access/content/products-state.service';
import { ProductCardComponent } from '../../ui/product-card/product-card.component';
import { CartStateService } from '../../../../data-access/cart/cart-state.service';
import { Product } from '../../../../Dto/Product.dto';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products= inject(ProductsStateService)
  cartState= inject(CartStateService).state;
  isSidebarVisible = false; // Control de visibilidad del menú lateral
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
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
