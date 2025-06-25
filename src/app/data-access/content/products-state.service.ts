  import { Injectable, inject } from '@angular/core';
  import { ProductsService } from './products.service';
  import { signalSlice } from 'ngxtension/signal-slice';
  import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';

  interface State {
    products: any | null;
    status: 'loading' | 'success' | 'error';
    page: number;
    selectedCategory: number | null; // ID de la categoría seleccionada
    selectedSubCategory: number | null; // ID de la subcategoría seleccionada
    selectedBrand: number | null; // ID de la marca seleccionada
  }

  interface Filters {
    categoryId: number | null;
    subCategoryId: number | null;
    brandId: number | null;
  }
  @Injectable({
    providedIn: 'root',
  })
  export class ProductsStateService {
    private productService = inject(ProductsService);

    private initialState: State = {
      products: [],
      status: 'loading',
      page: 1,
      selectedCategory: null,
      selectedSubCategory: null,
      selectedBrand: null,
    };

    // Nuevo `Subject` para manejar filtros combinados
filtersS = new Subject<Filters>();

// Combina todos los cambios de filtros en un único flujo
private combinedFilters$ = this.filtersS.pipe(
  startWith({
    categoryId: null,
    subCategoryId: null,
    brandId: null,
  })
);

    // Subjects para manejar cambios en los filtros y página
    changePageS = new Subject<number>();
    selectCategoryS = new Subject<number | null>();
    selectSubCategoryS = new Subject<number | null>();
    selectBrandS = new Subject<number | null>();

    // Combina filtros y paginación
loadProducts$ = this.changePageS.pipe(
  startWith(1), // Inicia con la página 1
  switchMap((page) =>
    this.combinedFilters$.pipe(
      
    )
  )
);

    // Estado gestionado por signalSlice
  
  }
