import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../core/services/catalog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sub-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.css'
})
export class SubCategoriesComponent {
displayedColumns: string[] = ['id', 'name','subCategoria', 'actions'];

  dataSource= new MatTableDataSource<any>([]);
    sortedData: any[] = [];
    modalCreate = false;
    modalEditar = false;
    modalEliminar = false;
    modalConfirmarEliminar = false;
    isSubmitting = false;

    fb = inject(FormBuilder)
  catalogService = inject(CatalogService)
 toastr = inject(ToastrService)

 createForm: FormGroup;
   editarForm: FormGroup;

  subCategories: any = [];
  idSubCategory: any = null;
  categories: any = [];

    searchText: string = '';
     timeout: any = null;
   
     @ViewChild(MatPaginator) paginator!: MatPaginator;
     constructor() {
       this.createForm = this.fb.group({
         name: ['', [Validators.required]],
         categoryId: ['',[Validators.required, Validators.pattern(/^[0-9]+$/)]],
       });
       this.editarForm = this.fb.group({
         name: [''],
         categoryId: ['',[Validators.required, Validators.pattern(/^[0-9]+$/)]],
       });
       this.listSubCategories();
     }

    listCategories(){
      this.catalogService.getCategories().subscribe(
        {
          next: (res) => {
            this.categories = res;
          },
          error: (err) => {
            console.log(err);
          }
        }
      )
    }

    listSubCategories(){
      this.catalogService.getAllSubCategories().subscribe(
        {
          next: (res) => {
            this.subCategories = res;
            this.feedDataSource(this.subCategories);
          },
          error: (err) => {
            console.log(err);
          }
        }
      )

    }

    openModalCreate() {
      this.modalCreate = true;
      this.listCategories();
      this.createForm.reset();
    }
  
    closeModalCreate() {
      this.modalCreate = false;
      this.createForm.reset();
    }

    onSubmitCreate() {
      console.log(this.createForm.value);
      if( this.createForm.invalid) {
        this.toastr.error('Formulario inválido', 'Error');
        return;
      };
      this.isSubmitting = true;
      const rawValue = this.createForm.value;
      const categoryIdNumber = Number(rawValue.categoryId);
      const payload = {
        ...rawValue,
        categoryId: categoryIdNumber
      };
      this.catalogService.createSubCategory(payload).subscribe({
        next: (res: any) => {
        
          this.toastr.success('Subcategoría creada', 'Éxito');
          this.closeModalCreate();
          this.isSubmitting = false;
          this.listSubCategories();
        },
        error: (err) => {
          console.log(err);
          this.isSubmitting = false;
          this.toastr.error('Error al crear la subcategoría', 'Error');
        }
      });
    }

    openModalEdit(data: any) {
      this.modalEditar = true;
      this.listCategories();
      this.idSubCategory = data.id;
      this.editarForm.patchValue({
        name: data.name,
        categoryId: data.categoryId,
        
      });
    }
  
    closeModalEdit() {
      this.modalEditar = false;
      this.editarForm.reset();
      this.idSubCategory = null;
    }

    onSubmitEdit() {
      if (this.editarForm.invalid){
        this.toastr.error('Formulario inválido', 'Error');
        return;
      };
      this.isSubmitting = true;
      const rawValue = this.editarForm.value;
      const categoryIdNumber = Number(rawValue.categoryId);
      const payload = {
        ...rawValue,
        categoryId: categoryIdNumber
      };
      this.catalogService.updateSubCategory(this.idSubCategory, payload).subscribe({
        next: (res) => {

          this.toastr.success('Subcategoría actualizada', 'Éxito');
          this.closeModalEdit();
          this.isSubmitting = false;
          this.listSubCategories();
        },
        error: (err) => {
          console.log(err);
          this.isSubmitting = false;
          this.toastr.error('Error al actualizar la subcategoría', 'Error');
        }
      });
    }

    openModalDelete(id: any) {
      this.modalEliminar = true;
      this.idSubCategory = id;
    }
  
    closeModalDelete() {
      this.modalEliminar = false;
      this.idSubCategory = null;
    }

    openModalConfirmDelete() {
      this.modalConfirmarEliminar = true;
    }
  
    closeModalConfirmDelete() {
      this.modalConfirmarEliminar = false;
    }

    onDeleteSubCategory() {
    
      this.isSubmitting = true;

      this.catalogService.deleteSubCategory(this.idSubCategory).subscribe({
        next: (res) => {
          this.toastr.success('Subcategoría eliminada', 'Éxito');
          this.closeModalDelete();
          this.closeModalConfirmDelete();
          this.isSubmitting = false;
          this.listSubCategories();
        },
        error: (err) => {
          console.log(err);
          this.isSubmitting = false;
          this.toastr.error('Error al eliminar la subcategoría', 'Error');
        }
      });
    }
  
    onSelectCategory(event: any) {
      const selectedCategoryId = event.value;
      const selectedCategory = this.categories.find((category: any) => category.id === selectedCategoryId) || null;

    }

    feedDataSource(data: any) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }

    sortData(sort: Sort) {
          console.log(sort);
          const data = this.subCategories.slice();
          if (!sort.active || sort.direction === '') {
            this.feedDataSource(data);
            return;
          }
          const sortedData = data.sort((a:any, b:any) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
              case 'id':
                return compare(a.id, b.id, isAsc);
              case 'name':
                return compare(a.name, b.name, isAsc);
              default:
                return 0;
            }
          });
      
          this.feedDataSource(sortedData);
        }
      
    onInputChange() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        console.log('Palabra buscada' + this.searchText);
        this.filterData();
      }, 300);
    }
  
    filterData() {
      const search = this.searchText;
      const data = this.subCategories.slice();
      if (!search) {
        this.feedDataSource(data);
        return;
      }
  
      const dataFiltered = data.filter((item:any) => {
        return item.name.includes(search);
      });
  
      this.feedDataSource(dataFiltered);
    }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}