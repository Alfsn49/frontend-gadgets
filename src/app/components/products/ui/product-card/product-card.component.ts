import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { addToCart } from '../../../../core/store/cart/cart.actions';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  product = input.required<any>();

  store = inject(Store);

  authService = inject(AuthService);

  addToCart= output<any>();

  toastr = inject(ToastrService);
  add(event: Event){

    if(this.authService.isLoggedIn){
      event.stopPropagation();
    event.preventDefault();
    
   
    console.log(this.product())
    const cartItem = {
      product_id: this.product().id,  // Accedemos al ID a través de product.product
      quantity: 1                     // Cantidad a añadir
    };
    console.log(cartItem)
    this.store.dispatch(addToCart({ product_id: cartItem.product_id, quantity: cartItem.quantity }));
    }else{
      this.toastr.info('Debes iniciar sesión para agregar productos al carrito', 'Login requerido');
    }


    

  }
}
