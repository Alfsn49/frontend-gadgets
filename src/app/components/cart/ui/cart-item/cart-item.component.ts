import { Component, input, output } from '@angular/core';
import { ProductItemCart } from '../../../../Dto/Product.dto';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
  productCartItem = input.required<any>();

  onRemove = output<number>();

  onIncrease = output<any>();

  onDecrease = output<any>();

  constructor() {
    // Constructor logic if needed
  console.log(this.productCartItem)
  }
}
