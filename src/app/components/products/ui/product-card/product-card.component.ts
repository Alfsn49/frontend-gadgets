import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  product = input.required<any>();

  addToCart= output<any>();

  add(event: Event){
    event.stopPropagation();
    event.preventDefault();
    
    console.log(this.product())
    this.addToCart.emit(this.product());

  }
}
