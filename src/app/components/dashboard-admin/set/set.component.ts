import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../core/services/catalog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-set',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, FormsModule, MatFormFieldModule],
  templateUrl: './set.component.html',
  styleUrl: './set.component.css'
})
export class SetComponent {
  displayedColumns: string[] = ['id', 'name','brand', 'actions'];
  dataSource= new MatTableDataSource<any>([]);
  sortedData: any[] = [];
  modalCreate = false;
  modalEditar = false;
  modalEliminar = false;
  modalConfirmarEliminar = false;
  isSubmitting = false;

  createForm: FormGroup;
  editarForm: FormGroup;

  sets: any = [];
  idSets: any = null;

  fb = inject(FormBuilder)
    catalogService = inject(CatalogService)
   toastr = inject(ToastrService)

  searchText: string = '';
  timeout: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  brands: any = [];
  constructor() {
    this.createForm = this.fb.group({
      name: [''],
      brandId: [''],
    });
    this.editarForm = this.fb.group({
      name: [''],
      brandId: [''],
    });
    this.listSets();
  }

  listSets(){
    this.catalogService.getSets().subscribe(
      {
        next: (res) => {
          this.sets = res;
          this.feedDataSource(this.sets);
        },
        error: (err) => {
          this.toastr.error('Error al cargar los sets', 'Error')
        }
      }
    )
  }

  listBrands(){
    this.catalogService.getBrands().subscribe(
      {
        next: (res) => {
          this.brands = res;

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
    this.listBrands();
    this.createForm.reset();
  }

  closeModalCreate() {
    this.modalCreate = false;
    this.createForm.reset();
  }

  onSubmitCreate(){
    if (this.createForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const rawValue = this.createForm.value;
      const brandIdNumber = Number(rawValue.brandId);

      const payload = {
        ...rawValue,
        brandId: brandIdNumber
      };

    this.catalogService.createSet(payload ).subscribe(
      {
        next: (res) => {
          this.toastr.success('Set creado con exito', 'Exito')
          this.listSets()
          this.closeModalCreate()
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toastr.error('Error al crear el set', 'Error')
          this.isSubmitting = false;
        }
      }
    )
  }

  openModalEdit(data: any) {

    this.modalEditar = true;
    this.editarForm.patchValue({
      name: data.name,
      brandId: data.brandId,
    });
    this.listBrands();
    this.idSets = data.id;
     
    
    console.log(this.editarForm.value);
  }

  closeModalEdit() {
    this.modalEditar = false;
    this.idSets = null;
    this.editarForm.reset();
  }

  onSubmitEdit() {
    const rawValue = this.editarForm.value;
    const brandIdNumber = Number(rawValue.brandId);
    const payload = {
      ...rawValue,
      brandId: brandIdNumber
    };
    console.log(payload); 
    this.catalogService.editSet(this.idSets, this.editarForm.value).subscribe(
      {
        next: (res) => {
          this.toastr.success('Set editado con exito', 'Exito')
          this.editarForm.reset();
          this.idSets = null;
          this.listSets()
          this.closeModalEdit()
        },
        error: (err) => {
          this.toastr.error('Error al editar el set', 'Error')
        }
      }
    )
  }

  openModalDelete(id: any) {
    this.modalEliminar = true;
    this.idSets = id;
  }

  closeModalDelete() {
    this.modalEliminar = false;
    this.idSets = null;
  }

  openModalConfirmDelete() {
    this.modalConfirmarEliminar = true;
  }

  closeModalConfirmDelete() {
    this.modalConfirmarEliminar = false;
  }

  onSubmitDelete() {
    this.catalogService.deleteSet(this.idSets).subscribe(
      {
        next: (res) => {
          this.toastr.success('Set eliminado con exito', 'Exito')
          this.listSets()
          this.closeModalDelete()
          this.closeModalConfirmDelete()
        },
        error: (err) => {
          this.toastr.error('Error al eliminar el set', 'Error')
        }
      }
    )
  }

  onSelectBrand(event: any) {
  const selectedBrandId = event.value;

  }

  feedDataSource(data: any) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

   sortData(sort: Sort) {
        console.log(sort);
        const data = this.sets.slice();
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
        const data = this.sets.slice();
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