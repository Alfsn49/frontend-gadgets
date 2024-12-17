import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  product = input.required<any>();

  authService = inject(AuthService);

  addToCart= output<any>();

  toastr = inject(ToastrService);
  add(event: Event){

    if(this.authService.isLoggedIn){
      event.stopPropagation();
    event.preventDefault();
    
    console.log(this.product())
    this.addToCart.emit(this.product());
    }else{
      this.toastr.info('Debes iniciar sesión para agregar productos al carrito', 'Login requerido');
    }


    

  }
}
