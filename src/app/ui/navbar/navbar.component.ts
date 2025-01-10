import { Component, effect, inject,HostListener,ElementRef  } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStateService } from '../../data-access/cart/cart-state.service';
import { AuthService } from '../../data-access/auth/auth.service';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
 cartState = inject(CartStateService).state

 router = inject(Router)

 public authService= inject(AuthService);
 constructor(private elementRef: ElementRef) {
  this.cartState.loaded()
  initFlowbite();
  effect(()=>{
    
  })
 }
 

onRemoveItem(id:number){
  console.log(id)
  this.cartState.remove(id);
}



logout(){
  this.authService.logout();
  this.router.navigate(['auth/login']);
}
}
