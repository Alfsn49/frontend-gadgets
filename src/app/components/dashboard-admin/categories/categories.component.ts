import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CatalogService } from '../core/services/catalog.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    DataTablesModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  sortedData: any[] = [];

  dtElement!: DataTableDirective;
  modalCreate = false;
  modalEditar = false;
  modalEliminar = false;
  modalConfirmarEliminar = false;

  fb = inject(FormBuilder);
  catalogService = inject(CatalogService);
  toastr = inject(ToastrService);

  createForm: FormGroup;
  editarForm: FormGroup;

  categories: any[] = [];
  idCategory: any = null;

  searchText: string = '';
  timeout: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
    });

    this.editarForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
    });

    this.listCategories();

   
  }

  listCategories() {
    this.catalogService.getCategories().subscribe((res: any) => {
      console.log(res);
      this.categories = res;
      this.feedDataSource(res);
    });
  }

  openModalCreate() {
    this.modalCreate = true;
  }

  closeModalCreate() {
    this.modalCreate = false;
    this.createForm.reset();
  }

  openModalEdit(data: any) {
    this.modalEditar = true;
    this.idCategory = data.id;
    this.editarForm.patchValue({
      name: data.name,
    });
  }

  closeModalEdit() {
    this.modalEditar = false;
    this.editarForm.reset();
    this.idCategory = null;
  }

  openModalDelete(id: any) {
    this.modalEliminar = true;
    this.idCategory = id;
  }

  closeModalDelete() {
    this.modalEliminar = false;
    this.idCategory = null;
  }

  openModalConfirmDelete() {
    this.modalConfirmarEliminar = true;
  }

  closeModalConfirmDelete() {
    this.modalConfirmarEliminar = false;
  }

  onSubmitCreate() {
    if (this.createForm.invalid) {
      this.toastr.error('Error', 'Formulario inválido');
      return;
    }
    this.catalogService.createCategory(this.createForm.value).subscribe({
      next: (res: any) => {
        this.toastr.success('Categoría creada correctamente', 'Éxito');
        this.modalCreate = false;
        this.createForm.reset();
        console.log(res);
        this.listCategories();
      },
      error: (err: any) => {
        console.log(err);
        this.toastr.error('Error', 'Error al crear la categoría');
      },
    });
  }

  onSubmitEdit() {
    this.catalogService
      .editCategory(this.idCategory, this.editarForm.value)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Categoría editada correctamente', 'Éxito');
          this.modalEditar = false;
          this.editarForm.reset();
          this.listCategories();
        },
        error: (err: any) => {
          console.log(err);
          this.toastr.error('Error', 'Error al editar la categoría');
        },
      });
  }

  onSubmitDelete() {
    this.catalogService.deleteCategory(this.idCategory).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toastr.success('Categoría eliminada correctamente', 'Éxito');
        this.modalConfirmarEliminar = false;
        this.modalEliminar = false;
        this.listCategories();
      },
      error: (err: any) => {
        console.log(err);
        this.toastr.error('Error', 'Error al eliminar la categoría');
      },
    });
  }

  feedDataSource(data: any) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  sortData(sort: Sort) {
    console.log(sort);
    const data = this.categories.slice();
    if (!sort.active || sort.direction === '') {
      this.feedDataSource(data);
      return;
    }
    const sortedData = data.sort((a, b) => {
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
    const data = this.categories.slice();
    if (!search) {
      this.feedDataSource(data);
      return;
    }

    const dataFiltered = data.filter((item) => {
      return item.name.includes(search);
    });

    this.feedDataSource(dataFiltered);
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
