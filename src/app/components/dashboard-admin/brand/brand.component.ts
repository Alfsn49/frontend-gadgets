import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../core/services/catalog.service';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, FormsModule, MatFormFieldModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css'
})
export class BrandComponent {
  displayedColumns: string[] = ['id', 'name', 'actions'];

  dataSource= new MatTableDataSource<any>([]);
    sortedData: any[] = [];
    modalCreate = false;
    modalEditar = false;
    modalEliminar = false;
    modalConfirmarEliminar = false;

    fb = inject(FormBuilder)
  catalogService = inject(CatalogService)
 toastr = inject(ToastrService)

 createForm: FormGroup;
   editarForm: FormGroup;

   brands: any = [];
   idBrand: any = null;

   searchText: string = '';
  timeout: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor() {
    this.createForm = this.fb.group({
      name: [''],
    });
    this.editarForm = this.fb.group({
      name: [''],
    });
    this.listBrands();
  }

  listBrands(){
    this.catalogService.getBrands().subscribe(
      {
        next: (res) => {
          this.brands = res;
          this.feedDataSource(this.brands);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error('Error al cargar las marcas', 'Error');
        }
      }
    )
  }

  openModalCreate() {
    this.modalCreate = true;
  }

  closeModalCreate() {
    this.modalCreate = false;
    this.createForm.reset();
  }

  onSubmitCreate() {
    if (this.createForm.invalid) {
      this.toastr.error('Error', 'Formulario inválido');
      return;
    }

    this.catalogService.createBrand(this.createForm.value).subscribe({
      next: (res: any) => {
        this.toastr.success('Marca creada', 'Éxito');
        this.createForm.reset();
        this.listBrands();
        this.closeModalCreate();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al crear la marca', 'Error');
      }
    });
  }

  openModalEdit(data: any) {
    this.modalEditar = true;
    this.idBrand = data.id;
    this.editarForm.patchValue({
      name: data.name,
    });
  }

  closeModalEdit() {
    this.modalEditar = false;
    this.editarForm.reset();
    this.idBrand = null;
  }

  onSubmitEdit(){
    if (this.editarForm.invalid) {
      this.toastr.error('Error', 'Formulario inválido');
      return;
    }

    this.catalogService.editBrand(this.idBrand, this.editarForm.value).subscribe({
      next: (res: any) => {
        this.toastr.success('Marca editada', 'Éxito');
        this.editarForm.reset();
        this.listBrands();
        this.closeModalEdit();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al editar la marca', 'Error');
      }
    });
  }

  openModalDelete(id: any) {
    this.modalEliminar = true;
    this.idBrand = id;
  }

  closeModalDelete() {
    this.modalEliminar = false;
    this.idBrand = null;
  }

  openModalConfirmDelete() {
    this.modalConfirmarEliminar = true;
  }

  closeModalConfirmDelete() {
    this.modalConfirmarEliminar = false;
  }
  
  onSubmitDelete(){
    this.catalogService.deleteBrand(this.idBrand).subscribe({
      next: (res: any) => {
        this.toastr.success('Marca eliminada', 'Éxito');
        this.listBrands();
        this.closeModalDelete();
        this.closeModalConfirmDelete();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al eliminar la marca', 'Error');
      }
    });
  }

  feedDataSource(data: any) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }
  sortData(sort: Sort) {
      console.log(sort);
      const data = this.brands.slice();
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
      const data = this.brands.slice();
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