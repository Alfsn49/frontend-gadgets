  import { Component, inject } from '@angular/core';

  import { ProductCardComponent } from '../../ui/product-card/product-card.component';
  import { CartStateService } from '../../../../../data-access/cart/cart-state.service';
  import { Product } from '../../../../../Dto/Product.dto';
  import { CommonModule } from '@angular/common';
  import { ProductsService } from '../../../../../data-access/content/products.service';
  import { Store } from '@ngrx/store';
  import { loadProducts } from '../../../../../data-access/content/products/state/products.actions';
import { combineLatest, map, Observable } from 'rxjs';
import { selectAllProducts, selectFilters, selectPage, selectTotalPages } from '../../../../../data-access/content/products/state/products.selectors';
import { addToCart } from '../../../../../core/store/cart/cart.actions';
  @Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [ProductCardComponent,CommonModule],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.css'
  })
  export class ProductListComponent {
    private store = inject(Store);
    products$: Observable<Product[]>;
    products: Product[] = [];
    page$ = this.store.select(selectPage);
    totalPages$ = this.store.select(selectTotalPages);
    pageData$ = combineLatest([this.page$, this.totalPages$]).pipe(
      map(([page, totalPages]) => ({ page, totalPages }))
    );
    page: number = 1;
totalPages: number = 1;
    filters$: Observable<any>;

    productsService= inject(ProductsService)
    
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

    constructor(){
      
      this.loadCategories();
      this.loadBrands();
      this.store.dispatch(loadProducts({ page: this.initialPage, limit:this.limit }));
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

    // filterByBrand(brandId: number) {
      
    //   if(this.selectedBrandId !== brandId){
    //     this.selectedBrandId = brandId; // Actualizamos la marca seleccionada

    //     this.selectedBrandId = null;
        

    //     this.products.selectBrandS.next(brandId);
    //   }

    // }

    // // Filtro de categoría
    // filterByCategory(categoryId: number) {
    //   console.log(this.selectedCategoryId)
    //   if (this.selectedCategoryId !== categoryId) {
    //     this.selectedCategoryId = categoryId; // Actualizamos la categoría seleccionada
    //     console.log('Filtrando por categoría:', categoryId);

    //     // Limpiar subcategorías al cambiar de categoría
    //     this.selectedSubcategoryId = null;
    //     this.subcategories = []; // Limpiar subcategorías cuando cambiamos de categoría

    //     this.filterBySubcategory(categoryId); // Filtrar por subcategoría
    //   }
    // }

    // // Filtro de subcategoría
    // filterBySubcategory(subcategoryId: number) {
    //   if (this.selectedCategoryId && subcategoryId) {
    //     this.selectedSubcategoryId = subcategoryId; // Actualizamos la subcategoría seleccionada
    //     console.log('Filtrando por subcategoría:', subcategoryId);

    //     // Llamar al servicio para obtener los productos filtrados por subcategoría
    //     this.productsService.getProducts(this.selectedCategoryId).subscribe((data) => {
    //       console.log('Productos filtrados por subcategoría:', data);
    //       // Aquí puedes actualizar el listado de productos según el filtro
    //     });
    //   } else {
    //     console.log('Selecciona primero una categoría');
    //   }
    // }

    // toggleCategorySelection(categoryId: number) {
    //   if (this.selectedCategoryId === categoryId) {
    //     // Deseleccionar la categoría
    //     this.selectedCategoryId = null;
    //     this.subcategories = []; // Limpiar las subcategorías
    //     this.selectedSubcategoryId = null; // Limpiar la subcategoría seleccionada
    //   } else {
    //     // Seleccionar la categoría
    //     this.selectedCategoryId = categoryId;
        
    //     // Cargar subcategorías para la categoría seleccionada
    //     this.productsService.getSubCategories(categoryId).subscribe((data) => {
    //       this.subcategories = data;
    //     });
    //   }
    
    //   // Actualizar los filtros
    //   this.products.filtersS.next({
    //     categoryId: this.selectedCategoryId,
    //     subCategoryId: this.selectedSubcategoryId,
    //     brandId: this.selectedBrandId,
    //   });
    // }
    
    
    // toggleSubcategorySelection(subcategoryId: number) {
    //   this.selectedSubcategoryId =
    //     this.selectedSubcategoryId === subcategoryId ? null : subcategoryId;
    
    //   this.products.filtersS.next({
    //     categoryId: this.selectedCategoryId,
    //     subCategoryId: this.selectedSubcategoryId,
    //     brandId: this.selectedBrandId,
    //   });
    // }
    
    // toggleBrandSelection(brandId: number) {
    //   this.selectedBrandId =
    //     this.selectedBrandId === brandId ? null : brandId;
    
    //   this.products.filtersS.next({
    //     categoryId: this.selectedCategoryId,
    //     subCategoryId: this.selectedSubcategoryId,
    //     brandId: this.selectedBrandId,
    //   });
    // }
  }
