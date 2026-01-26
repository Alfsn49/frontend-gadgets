import { Component, inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, map, Observable, takeUntil } from 'rxjs';

import { ProductCardComponent } from '../../ui/product-card/product-card.component';
import { Product } from '../../../../../Dto/Product.dto';
import { ProductsService } from '../../../../../data-access/content/products.service';
import { loadProducts } from '../../../../../data-access/content/products/state/products.actions';
import { selectAllProducts, selectFilters, selectPage, selectProductStatus, selectTotalPages } from '../../../../../data-access/content/products/state/products.selectors';
import { addToCart } from '../../../../../core/store/cart/cart.actions';
import { ToastrService } from 'ngx-toastr';

interface Filters {
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  sort: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnDestroy {
  private store = inject(Store);
  private productsService = inject(ProductsService);
  private toastr = inject(ToastrService);
  private destroy$ = new Subject<void>();
  
  readonly status$ = this.store.select(selectProductStatus);
  readonly page$ = this.store.select(selectPage);
  readonly totalPages$ = this.store.select(selectTotalPages);
  readonly filters$ = this.store.select(selectFilters);
  readonly products$: Observable<Product[]> = this.store.select(selectAllProducts);
  
  readonly pageData$ = combineLatest([this.page$, this.totalPages$]).pipe(
    map(([page, totalPages]) => ({ page, totalPages }))
  );

  // Estado local
  products: Product[] = [];
  page: number = 1;
  totalPages: number = 1;
  showFilters = false; // Control para mostrar/ocultar filtros
  categories: any[] = [];
  brands: any[] = [];

  // Filtros
  readonly initialPage = 1;
  readonly limit = 12;
  filters: Filters = {
    category: '',
    minPrice: null,
    maxPrice: null,
    sort: '',
  };

  tempFilters: Filters = { ...this.filters };
  isApplyingFilters = false;
  filtersHaveChanged = false;

  constructor() {
    this.setupSubscriptions();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    this.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.products = data;
      });

    this.pageData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ page, totalPages }) => {
        this.page = page;
        this.totalPages = totalPages;
      });
  }

  private loadInitialData(): void {
    this.store.dispatch(loadProducts({ 
      page: this.initialPage, 
      limit: this.limit, 
      filters: this.filters 
    }));
    
    this.productsService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.categories = data;
      });
    
    this.productsService.getBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.brands = data;
      });
  }

  // Toggle para mostrar/ocultar filtros
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // Obtener texto para ordenamiento
  getSortLabel(sortValue: string): string {
    switch(sortValue) {
      case 'name_asc': return 'Nombre A-Z';
      case 'name_desc': return 'Nombre Z-A';
      case 'price_asc': return 'Precio ↑';
      case 'price_desc': return 'Precio ↓';
      default: return 'Por defecto';
    }
  }

  // Contar filtros activos
  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filters.category) count++;
    if (this.filters.minPrice !== null) count++;
    if (this.filters.maxPrice !== null) count++;
    if (this.filters.sort) count++;
    return count;
  }

  // Remover un filtro específico
  removeFilter(filterKey: keyof Filters): void {
    if (filterKey === 'minPrice' || filterKey === 'maxPrice') {
      this.tempFilters = { ...this.tempFilters, [filterKey]: null };
    } else {
      this.tempFilters = { ...this.tempFilters, [filterKey]: '' };
    }
    
    this.filtersHaveChanged = true;
    this.applyFilters();
  }

  onFilterChange(key: keyof Filters, value: any): void {
    // Convertir a número si es un string y no está vacío
    if ((key === 'minPrice' || key === 'maxPrice')) {
      if (value === '' || value === null) {
        value = null;
      } else {
        value = Number(value);
      }
    }

    // Validación inmediata
    if (key === 'minPrice' || key === 'maxPrice') {
      const newTempFilters = { ...this.tempFilters, [key]: value };
      
      // Validar que minPrice no sea mayor que maxPrice
      if (this.hasInvalidPriceRange(newTempFilters.minPrice, newTempFilters.maxPrice)) {
        if (newTempFilters.minPrice !== null && newTempFilters.maxPrice !== null) {
          this.toastr.warning('El precio mínimo no puede ser mayor que el precio máximo', 'Filtro inválido', {
            timeOut: 4000,
            positionClass: 'toast-top-right'
          });
        }
      }
      
      // Validar que el precio no sea negativo
      if (value !== null && value < 0) {
        this.toastr.warning('El precio no puede ser negativo', 'Valor inválido', {
          timeOut: 3000,
          positionClass: 'toast-top-right'
        });
        value = null;
      }
    }
    
    // Actualizar filtros temporales
    this.tempFilters = { ...this.tempFilters, [key]: value };
    
    // Marcar que hubo cambios
    this.filtersHaveChanged = true;
  }

  private hasInvalidPriceRange(minPrice: number | null, maxPrice: number | null): boolean {
    if (minPrice !== null && maxPrice !== null) {
      return minPrice > maxPrice;
    }
    return false;
  }

  // Verificar si hay filtros activos
  hasActiveFilters(): boolean {
    return !!(
      this.filters.category ||
      this.filters.minPrice !== null ||
      this.filters.maxPrice !== null ||
      this.filters.sort
    );
  }

  // Aplicar filtros y cerrar panel
  applyFiltersAndClose(): void {
    this.applyFilters();
    this.showFilters = false;
  }

  // Cancelar cambios y cerrar panel
  cancelFiltersAndClose(): void {
    this.cancelFilters();
    this.showFilters = false;
  }

  applyFilters(): void {
    // Validar antes de aplicar
    if (this.hasInvalidPriceRange(this.tempFilters.minPrice, this.tempFilters.maxPrice)) {
      this.toastr.error('No se pueden aplicar filtros con precios inválidos', 'Error en filtros', {
        timeOut: 4000,
        positionClass: 'toast-top-center'
      });
      return;
    }
    
    // Actualizar filtros activos
    this.filters = { ...this.tempFilters };
    this.filtersHaveChanged = false;
    
    // Mostrar estado de carga
    this.isApplyingFilters = true;
    
    // Notificación
    this.toastr.info('Aplicando filtros...', '', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });
    
    // Despachar acción
    this.store.dispatch(loadProducts({ 
      page: 1, 
      limit: this.limit, 
      filters: this.filters 
    }));
    
    // Resetear estado
    setTimeout(() => {
      this.isApplyingFilters = false;
    }, 1000);
  }

  addToCart(product: Product): void {
    // this.store.dispatch(addToCart({ product }));
    
    // this.toastr.success(`${product.name} agregado al carrito`, '✅ Producto agregado', {
    //   timeOut: 3000,
    //   positionClass: 'toast-top-right'
    // });
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) {
      this.toastr.warning(`La página ${newPage} no existe`, 'Página inválida', {
        timeOut: 3000
      });
      return;
    }
    
    this.store.dispatch(loadProducts({ 
      page: newPage, 
      limit: this.limit,
      filters: this.filters
    }));
  }

  resetFilters(): void {
    this.tempFilters = {
      category: '',
      minPrice: null,
      maxPrice: null,
      sort: '',
    };
    
    this.filters = { ...this.tempFilters };
    this.filtersHaveChanged = true;
    
    this.toastr.success('Filtros restablecidos', '✅', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });
    
    this.store.dispatch(loadProducts({ 
      page: 1, 
      limit: this.limit, 
      filters: this.filters 
    }));
    
    // Cerrar panel si está abierto
    this.showFilters = false;
  }

  cancelFilters(): void {
    this.tempFilters = { ...this.filters };
    this.filtersHaveChanged = false;
    
    this.toastr.info('Cambios en filtros cancelados', '', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });
  }
}