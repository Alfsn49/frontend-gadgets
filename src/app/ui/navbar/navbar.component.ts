import { Component, inject, HostListener, ElementRef, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStateService } from '../../data-access/cart/cart-state.service';
import { AuthService } from '../../data-access/auth/auth.service';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { debounceTime, distinctUntilChanged, switchMap, Observable, Subject, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../../core/store/auth/auth.reducer';
import { CommonModule } from '@angular/common';
import { logout } from '../../core/store/auth/auth.actions';
import { FormControl, FormsModule } from '@angular/forms';
import { ProductsService } from '../../data-access/content/products.service';
import { loadCart, removeCartItem } from '../../core/store/cart/cart.actions';
import { selectCart } from '../../core/store/cart/cart.selectors';

interface CartItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  name: string;
  image: string;
}

interface Cart {
  id: string;
  user_id: string;
  total: number;
  completed: boolean;
  items: CartItem[]; // Este es el array que contiene los productos
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  loading = input<false>() ;
  toggleSidebarEvent = output<any>() ;
  searchControl = new FormControl('');
  results: any = [];
  searchQuery: string = '';
  searchResults: any = [];
  showResults = false;
  private searchSubject = new Subject<string>();
  data$: Cart | any = null;
  cartData$ = this.store.select(selectCart);
  isSidebarOpen: boolean = true;
  router = inject(Router);
  isAuthenticated$: Observable<boolean>;
  productService = inject(ProductsService);

  public authService = inject(AuthService);

  constructor(private elementRef: ElementRef, private store: Store<{ auth: AuthState }>) {
    
    
    this.cartData$.subscribe((data:Cart) => {
      this.data$ = data;
      console.log('Datos del carrito:', data);
    });
    initFlowbite();
    this.isAuthenticated$ = this.store.select(state => state.auth.isAuthenticated);

    // Suscripción para manejar el valor del formulario
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((query) => query ?? ''),  // Reemplaza null por una cadena vacía
      switchMap((query: string) => this.productService.searchProducts(query))
    )
    .subscribe((results) => {
      this.results = results;
      this.searchResults = results;
    });
  }



  toggleSidebar(): void {
    this.toggleSidebarEvent.emit(true);
    localStorage.setItem('sidebarState', JSON.stringify(this.isSidebarOpen));
  }
  onRemoveItem(id: number) {
    console.log(id);
    this.store.dispatch(removeCartItem({product_id:id}))
  }

  logout() {
    // Cerrar menú manualmente
    const dropdown = document.getElementById('userDropdown1');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
    this.store.dispatch(logout());
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    // Solo hace búsqueda si el input tiene más de 2 caracteres
    if (query.length >= 3) {
      this.productService.searchProducts(query).subscribe(results => {
        this.searchResults = results;
      });
    } else if (query.length > 0) {
      this.productService.searchProducts(query).subscribe(results => {
        this.searchResults = results;
      });
    } else {
      this.searchResults = [];
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.relative')) {
      this.showResults = false;
    }
  }

  highlightMatch(name: string, query: string): string {
    if (!query) return name;
    const escapedQuery = query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedQuery})`, 'i');
    return name.replace(regex, '<span class="text-blue-500 font-bold">$1</span>');
  }
}
