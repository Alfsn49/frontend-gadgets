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
import { selectCart, selectCartLoaded, selectCartStatus } from '../../core/store/cart/cart.selectors';
import { CartState } from '../../core/store/cart/cart.reducer';
import { selectRole } from '../../core/store/auth/auth.selectors';

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
  showCartDropdown = false;
  showDropAccount = false;
  results: any = [];
  searchQuery: string = '';
  searchResults: any = [];
  showResults = false;
showMobileMenu: boolean = false;
  private searchSubject = new Subject<string>();
  data$: Cart | any = null;
  idProducto: any;
  showMobileSearch:any;
  cartStatus$ = this.store.select(selectCartStatus);
  isSidebarOpen: boolean = true;
  isMobileMenuOpen = false;
  router = inject(Router);
  isAuthenticated$!: Observable<boolean>;
  productService = inject(ProductsService);
  cart$!: Observable<any>;
  rol$:any

  modalEliminar:boolean = false;
 
  myrol:string = '';

  public authService = inject(AuthService);

  // constructor(private elementRef: ElementRef, private store: Store<{ auth: AuthState, cart: CartState }>) {
    
  //   this.rol$ = this.store.select(selectRole).subscribe((role) => {
  //     console.log('Rol del usuario:', role);
  //     this.myrol = role;
  //   });

  //   console.log("Autenticado", this.myrol)
  //   this.isAuthenticated$ = this.store.select(state => state.auth.isAuthenticated);
  //   // SOLUCIÓN: Verificar autenticación ANTES de cargar el carrito
  //   this.isAuthenticated$.subscribe(isAuthenticated => {
  //     if (isAuthenticated && this.myrol !== 'Administrador') {
  //       console.log('Usuario autenticado, cargando carrito...');
  //       this.store.dispatch(loadCart());
  //     } else {
  //       console.log('No se carga carrito - Usuario no autenticado o es administrador');
  //     }
  //   });
    
  //  if(this.myrol !== 'Administrador' || this.myrol !== undefined){
    

  //   this.store.dispatch(loadCart());
  //   this.cart$ = this.store.select(selectCart);
  //   this.cart$.subscribe((data)=>{
  //     this.data$ = data;
  //     console.log("Datos del carrito:", data)
  //   })
  //   // this.cart$ = this.store.select(state => state.cart.cart); 
  //   // this.cartData$.subscribe((data:Cart) => {
  //   //   this.data$ = data;
  //   //   console.log('Datos del carrito:', data);
  //   // });
  //  }else{
    
  //  }
  //   initFlowbite();
    

  //   // Suscripción para manejar el valor del formulario
  //   this.searchControl.valueChanges.pipe(
  //     debounceTime(300),
  //     distinctUntilChanged(),
  //     map((query) => query ?? ''),  // Reemplaza null por una cadena vacía
  //     switchMap((query: string) => this.productService.searchProducts(query))
  //   )
  //   .subscribe((results) => {
  //     this.results = results;
  //     this.searchResults = results;
  //   });
  // }
  constructor(private elementRef: ElementRef, private store: Store<{ auth: AuthState, cart: CartState }>) {
    
    this.rol$ = this.store.select(selectRole).subscribe((role) => {
      console.log('Rol del usuario:', role);
      this.myrol = role;
    });

    console.log("Autenticado", this.myrol)
    this.isAuthenticated$ = this.store.select(state => state.auth.isAuthenticated);
    // SOLUCIÓN: Verificar autenticación ANTES de cargar el carrito
    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated && this.myrol !== 'Administrador') {
        console.log('Usuario autenticado, cargando carrito...');
        this.store.dispatch(loadCart());
        this.cart$ = this.store.select(selectCart);
    this.cart$.subscribe((data)=>{
      this.data$ = data;
      console.log("Datos del carrito:", data)
    })
      } else {
        console.log('No se carga carrito - Usuario no autenticado o es administrador');
      }
    });

    
    initFlowbite();
    

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

  toggleCartDropdown() {
    this.showCartDropdown = !this.showCartDropdown;
    if(this.showDropAccount){
      this.showDropAccount = false;
    }
  }

  toggleDropAccount() {
    this.showDropAccount = !this.showDropAccount;
    if(this.showCartDropdown){
      this.showCartDropdown = false;
    }
  }


  toggleSidebar(): void {
    this.toggleSidebarEvent.emit(true);
    localStorage.setItem('sidebarState', JSON.stringify(this.isSidebarOpen));
  }


  onRemoveItem(id: number) {
    console.log(id);
    this.modalEliminar = true
    this.idProducto = id
    this.store.dispatch(removeCartItem({product_id:id}))
  }

  logout() {
    // Cerrar menú manualmente
    const dropdown = document.getElementById('userDropdown1');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
    this.showDropAccount = false;
    this.showCartDropdown = false;
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
  hideResultsLater() {
  setTimeout(() => this.showResults = false, 200); // para evitar ocultar al hacer clic
}
navigateToProduct(productId: string) {
  this.router.navigate(['/product', productId]);
  this.showResults = false;
}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('Toggle ejecutado:', this.isMobileMenuOpen);
  }
  closeSearch() {
    this.showResults = false;
  }
  reloadCart(){
      
    }

    closeModalDelete(){
      this.modalEliminar = false;
    }

    openModalConfirmDelete(){
      this.store.dispatch(removeCartItem({product_id:this.idProducto}))
      this.closeModalDelete();
    }
    
// Método para alternar búsqueda móvil
toggleMobileSearch(): void {
  this.showMobileSearch = !this.showMobileSearch;
  // Si abrimos la búsqueda móvil, cerramos el menú móvil
  if (this.showMobileSearch) {
    this.showMobileMenu = false;
  }
}



// Método para cerrar menú móvil (al hacer clic en enlace)
closeMobileMenu(): void {
  this.showMobileMenu = false;
}
@HostListener('document:click', ['$event'])
onDocumentClick(event: Event): void {
  const target = event.target as HTMLElement;
  
  // Cerrar dropdown de cuenta si se hace clic fuera
  if (this.showDropAccount && !target.closest('.relative > button') && !target.closest('.absolute')) {
    this.showDropAccount = false;
  }
  
  // Cerrar dropdown del carrito si se hace clic fuera
  if (this.showCartDropdown && !target.closest('.relative > button') && !target.closest('.absolute')) {
    this.showCartDropdown = false;
  }
  
  // Cerrar resultados de búsqueda si se hace clic fuera
  if (this.showResults && !target.closest('.relative input') && !target.closest('.absolute')) {
    this.showResults = false;
  }
}

}
