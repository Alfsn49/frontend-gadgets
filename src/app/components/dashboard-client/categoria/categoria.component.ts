import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../data-access/content/products.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoria.component.html'
})
export class CategoriaComponent implements OnInit {
  productService = inject(ProductsService);
  toastr = inject(ToastrService);
  router = inject(Router);
  
  categories: any = null;
  isLoading = true;
  error: string = '';

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.isLoading = true;
    this.error = '';
    
    // Usamos 'any' para evitar problemas de tipos
    this.productService.getCategoriesForDisplay().subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.categories = response;
        } else {
          this.error = response?.error || 'Error desconocido';
          this.toastr.error(this.error);
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = err.message || 'Error de conexión';
        this.toastr.error('Error al cargar categorías');
        this.isLoading = false;
      }
    });
  }

  getCategoryGradient(categoryId: number): string {
    const gradients: any = {
      1: 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700',
      2: 'bg-gradient-to-br from-green-500 via-green-600 to-teal-700'
    };
    return gradients[categoryId] || 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700';
  }

  navigateToCategory(category: any) {
    if (category && category.hasProducts && category.slug) {
      this.router.navigate(['/categorias', category.slug]);
    } else {
      this.toastr.info('Próximamente disponible');
    }
  }
}