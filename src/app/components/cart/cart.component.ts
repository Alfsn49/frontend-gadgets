import { Component, inject } from '@angular/core';
import { CartItemComponent } from "./ui/cart-item/cart-item.component";
import { CartStateService } from '../../data-access/cart/cart-state.service';
import { ProductItemCart } from '../../Dto/Product.dto';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  state = inject(CartStateService).state;

  onRemoveItem(id:number){
    console.log(id)
    this.state.remove(id);
  }

  onDecrease(product:any){
    console.log(product)
    this.state.update({
      product:product.product,
      quantity:-1
    })
  }

  onIncrease(product:any){
    console.log(product)
    this.state.update({
      product:product.product,
      quantity:1
    })
  }

  checkout(){
    console.log('checkout')
    console.log(this.state.products())
    const dataCheckout = this.state.products().map(product=>{
      return{
        amount: product.product.price * 100, // Multiplica por 100 si usas centavos para Stripe
    currency: "usd",
    productId: product.product.id,
    name: product.product.name,
    image: product.product.image,
    quantity: product.quantity
      }
    })
    console.log(dataCheckout)
  }
}
