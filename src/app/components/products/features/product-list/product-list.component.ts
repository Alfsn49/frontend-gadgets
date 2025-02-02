  import { Component, inject } from '@angular/core';
  import { ProductsStateService } from '../../../../data-access/content/products-state.service';
  import { ProductCardComponent } from '../../ui/product-card/product-card.component';
  import { CartStateService } from '../../../../data-access/cart/cart-state.service';
  import { Product } from '../../../../Dto/Product.dto';
  import { CommonModule } from '@angular/common';
  import { ProductsService } from '../../../../data-access/content/products.service';
  @Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [ProductCardComponent, CommonModule],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.css'
  })
  export class ProductListComponent {
    products= inject(ProductsStateService)
    productsService= inject(ProductsService)
    cartState= inject(CartStateService).state;
    isSidebarVisible = false; // Control de visibilidad del menú lateral
    categories:any = [];
    subcategories:any = [];
    brands:any = [];
    selectedCategoryId: number | null = null;
    selectedBrandId: number | null = null;
    selectedSubcategoryId: number | null = null;
    constructor(){
      this.loadCategories();
      this.loadBrands();
    }

    

    changePage(){
      const page = this.products.state.page() + 1;
      this.products.changePageS.next(page);
    }
    addToCart(product:any){
      console.log(product)
      this.cartState.add({
        product,
        quantity: 1
      })
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

    filterByBrand(brandId: number) {
      
      if(this.selectedBrandId !== brandId){
        this.selectedBrandId = brandId; // Actualizamos la marca seleccionada

        this.selectedBrandId = null;
        

        this.products.selectBrandS.next(brandId);
      }

    }

    // Filtro de categoría
    filterByCategory(categoryId: number) {
      console.log(this.selectedCategoryId)
      if (this.selectedCategoryId !== categoryId) {
        this.selectedCategoryId = categoryId; // Actualizamos la categoría seleccionada
        console.log('Filtrando por categoría:', categoryId);

        // Limpiar subcategorías al cambiar de categoría
        this.selectedSubcategoryId = null;
        this.subcategories = []; // Limpiar subcategorías cuando cambiamos de categoría

        this.filterBySubcategory(categoryId); // Filtrar por subcategoría
      }
    }

    // Filtro de subcategoría
    filterBySubcategory(subcategoryId: number) {
      if (this.selectedCategoryId && subcategoryId) {
        this.selectedSubcategoryId = subcategoryId; // Actualizamos la subcategoría seleccionada
        console.log('Filtrando por subcategoría:', subcategoryId);

        // Llamar al servicio para obtener los productos filtrados por subcategoría
        this.productsService.getProducts(this.selectedCategoryId).subscribe((data) => {
          console.log('Productos filtrados por subcategoría:', data);
          // Aquí puedes actualizar el listado de productos según el filtro
        });
      } else {
        console.log('Selecciona primero una categoría');
      }
    }

    toggleCategorySelection(categoryId: number) {
      if (this.selectedCategoryId === categoryId) {
        // Deseleccionar la categoría
        this.selectedCategoryId = null;
        this.subcategories = []; // Limpiar las subcategorías
        this.selectedSubcategoryId = null; // Limpiar la subcategoría seleccionada
      } else {
        // Seleccionar la categoría
        this.selectedCategoryId = categoryId;
        
        // Cargar subcategorías para la categoría seleccionada
        this.productsService.getSubCategories(categoryId).subscribe((data) => {
          this.subcategories = data;
        });
      }
    
      // Actualizar los filtros
      this.products.filtersS.next({
        categoryId: this.selectedCategoryId,
        subCategoryId: this.selectedSubcategoryId,
        brandId: this.selectedBrandId,
      });
    }
    
    
    toggleSubcategorySelection(subcategoryId: number) {
      this.selectedSubcategoryId =
        this.selectedSubcategoryId === subcategoryId ? null : subcategoryId;
    
      this.products.filtersS.next({
        categoryId: this.selectedCategoryId,
        subCategoryId: this.selectedSubcategoryId,
        brandId: this.selectedBrandId,
      });
    }
    
    toggleBrandSelection(brandId: number) {
      this.selectedBrandId =
        this.selectedBrandId === brandId ? null : brandId;
    
      this.products.filtersS.next({
        categoryId: this.selectedCategoryId,
        subCategoryId: this.selectedSubcategoryId,
        brandId: this.selectedBrandId,
      });
    }
  }
