import { Component, inject,HostListener,ElementRef  } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStateService } from '../../data-access/cart/cart-state.service';
import { AuthService } from '../../data-access/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
 cartState = inject(CartStateService).state

 router = inject(Router)
 isUserMenuVisible = false;
 public authService= inject(AuthService);
 constructor(private elementRef: ElementRef) {}
 toggleUserMenu() {
  this.isUserMenuVisible = !this.isUserMenuVisible;
}
onRemoveItem(id:number){
  console.log(id)
  this.cartState.remove(id);
}

// Detectar clics fuera del menú para cerrarlo
@HostListener('document:click', ['$event'])
onClickOutside(event: MouseEvent) {
  const targetElement = event.target as HTMLElement;

  // Cierra el menú solo si el clic ocurre fuera de este elemento
  if (!this.elementRef.nativeElement.contains(targetElement)) {
    this.isUserMenuVisible = false;
  }
}

logout(){
  this.authService.logout();
  this.router.navigate(['/login']);
}
}
