  import { Component, inject } from '@angular/core';

  import { ProductCardComponent } from '../../ui/product-card/product-card.component';
  import { CartStateService } from '../../../../../data-access/cart/cart-state.service';
  import { Product } from '../../../../../Dto/Product.dto';
  import { CommonModule } from '@angular/common';
  import { ProductsService } from '../../../../../data-access/content/products.service';
  import { Store } from '@ngrx/store';
  import { loadProducts } from '../../../../../data-access/content/products/state/products.actions';
import { combineLatest, debounceTime, map, Observable, Subject } from 'rxjs';
import { selectAllProducts, selectFilters, selectPage, selectTotalPages } from '../../../../../data-access/content/products/state/products.selectors';
import { addToCart } from '../../../../../core/store/cart/cart.actions';
import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [ProductCardComponent,CommonModule, FormsModule],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.css'
  })
  export class ProductListComponent {
    private store = inject(Store);
    
    products: Product[] = [];
    page$ = this.store.select(selectPage);
    totalPages$ = this.store.select(selectTotalPages);
    pageData$ = combineLatest([this.page$, this.totalPages$]).pipe(
      map(([page, totalPages]) => ({ page, totalPages }))
    );
    page: number = 1;
  totalPages: number = 1;
  

    productsService= inject(ProductsService)
    products$: Observable<any> = this.store.select(selectAllProducts);
  filters$: Observable<any> = this.store.select(selectFilters);
    private filterSubject = new Subject<void>();
    //cartState= inject(CartStateService).state;
    isSidebarVisible = false; // Control de visibilidad del menú lateral
    categories:any = [];
    subcategories:any = [];
    brands:any = [];
    selectedCategoryId: number | null = null;
    selectedBrandId: number | null = null;
    selectedSubcategoryId: number | null = null;

    initialPage = 1; // Página inicial
    limit = 10; // Número de productos por página
    filters = {
    category: '',
    minPrice: null,
    maxPrice: null,
    sort: '',
  };


    constructor(){
      
      this.loadCategories();
      this.loadBrands();
      this.store.dispatch(loadProducts({ page: this.initialPage, limit:this.limit, filters: this.filters }));
      this.products$ = this.store.select(selectAllProducts);
      this.products$.subscribe((data) => {
        this.products = data;
        console.log('Productos cargados:', data);
      });
      this.pageData$.subscribe(({ page, totalPages }) => {
        console.log('Página actual:', page);
        console.log('Total de páginas:', totalPages);
        this.page = page;
        this.totalPages = totalPages;
      });

    this.page$ = this.store.select(selectPage);
    this.filters$ = this.store.select(selectFilters);
    console.log('Dispatching loadProducts()');  
    
      this.filterSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.applyFilters();
    });
    }
    onFilterChange(key: string, value: any) {
  this.filters = { ...this.filters, [key]: value };
  console.log('Filtros actualizados:', this.filters);
  this.filterSubject.next();
  //this.applyFilters(); // Aplicamos los filtros inmediatamente al cambiar
  // Aquí no llamamos a aplicar filtros todavía, solo probamos que se actualice bien
}

    
    applyFilters() {
      console.log('Aplicando filtros:', this.filters);
    this.store.dispatch(loadProducts({ page: 1, limit: this.limit, filters: this.filters }));
  }

   
    addToCart(product:any){
      console.log(product)
      
      // this.cartState.add({
      //   product,
      //   quantity: 1
      // })
    }
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    }

    loadCategories() {
      // Suponiendo que tienes un método para obtener las categorías
      this.productsService.getCategories().subscribe((data: any) => {
        this.categories = data;
      });
    }
    loadBrands() {
      this.productsService.getBrands().subscribe((data: any) => {
        console.log('Marcas obtenidas:', data);
        this.brands = data;
      });
    }

    changePage(newPage:number){
      if (newPage < 1 || newPage > this.totalPages) {
        return;
      }
    
      this.store.dispatch(loadProducts({ page: newPage, limit: this.limit }));
    }

  }
