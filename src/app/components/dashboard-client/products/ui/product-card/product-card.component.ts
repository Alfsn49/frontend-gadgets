import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { addToCart } from '../../../../../core/store/cart/cart.actions';
import { Observable } from 'rxjs';

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

  isAuthenticated$: Observable<boolean>;

  isAuthenticated: boolean = false;

  constructor(){
    this.isAuthenticated$ = this.store.select(state => state.auth.isAuthenticated);

    this.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      console.log('isAuthenticated:', this.isAuthenticated);
    });
  }
  add(event: Event){
    event.preventDefault(); // ← esto evita el redireccionamiento
    console.log(this.isAuthenticated)
    if(this.isAuthenticated){
    console.log("funciona")
    
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
stockPercentage = computed(() => {
  const stock = this.product().stock;
  if (stock === 0) return 0;
  return Math.min((stock / 25) * 100, 100);
});

stockBarClass = computed(() => {
  const stock = this.product().stock;
  if (stock <= 3) return 'bg-gradient-to-r from-red-500 to-red-600';
  if (stock <= 8) return 'bg-gradient-to-r from-orange-500 to-amber-500';
  if (stock <= 15) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
  return 'bg-gradient-to-r from-green-500 to-emerald-500';
});


// Método opcional para notificar disponibilidad
notifyWhenAvailable() {
  // Lógica para notificar al usuario cuando el producto esté disponible
  console.log('Notificar cuando esté disponible:', this.product().id);
  // Podrías abrir un modal o enviar una solicitud al backend
}
}
