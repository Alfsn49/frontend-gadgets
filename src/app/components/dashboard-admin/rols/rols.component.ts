import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-rols',
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
  templateUrl: './rols.component.html',
  styleUrl: './rols.component.css',
})
export class RolsComponent {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  sortedData: any[] = [];

  modalCreate = false;
  modalEditar = false;
  modalEliminar = false;
  modalConfirmarEliminar = false;

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastr = inject(ToastrService);

  createForm!: FormGroup;
  editarForm!: FormGroup;

  rols: any = [];
  idRol: any = null;

  searchText: string = '';
  timeout: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
    });

    this.editarForm = this.fb.group({
      name: [''],
    });
    this.listRols();
  }

  listRols() {
    this.authService.getRols().subscribe({
      next: (res: any) => {
        console.log(res);
        this.rols = res;
        if (this.rols.length > 0) {
          this.feedDataSource(this.rols);
        } else {
          this.toastr.info('No se encontraron roles', 'Información');
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al obtener los roles', 'Error');
      },
    });
  }

  openModalCreate() {
    this.modalCreate = true;
  }

  closeModalCreate() {
    this.modalCreate = false;
    this.createForm.reset();
  }

  onSubmitCreate() {
    this.authService.createRol(this.createForm.value).subscribe({
      next: (res: any) => {
        this.toastr.success('Rol creado correctamente', 'Exito');
        this.listRols();
        this.closeModalCreate();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al crear el rol', 'Error');
      },
    });
  }

  openModalEdit(data: any) {
    this.modalEditar = true;
    this.idRol = data.id;
    this.editarForm.patchValue({
      name: data.name,
    });
  }

  closeModalEdit() {
    this.modalEditar = false;
    this.editarForm.reset();
    this.idRol = null;
  }

  onSubmitEdit() {
    this.authService
      .updateRol(this.idRol, this.editarForm.value)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Rol editado correctamente', 'Exito');
          this.listRols();
          this.closeModalEdit();
        },
        error: (err) => {
          console.log(err);
          this.toastr.error('Error al editar el rol', 'Error');
        },
      });
  }


  openModalDelete(id: any) {
    this.modalEliminar = true;
    this.idRol = id;
  }

  closeModalDelete() {
    this.modalEliminar = false;
    this.idRol = null;
  }

  openModalConfirmDelete() {
    this.modalConfirmarEliminar = true;
  }

  closeModalConfirmDelete() {
    this.modalConfirmarEliminar = false;
  }

  onSubmitDelete(){
    this.authService.deleteRol(this.idRol).subscribe({
      next: (res: any) => {
        this.toastr.success('Rol eliminado correctamente', 'Exito');
        this.listRols();
        this.closeModalDelete();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al eliminar el rol', 'Error');
      },
    });
  }

  feedDataSource(data: any) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  sortData(sort: Sort) {
    console.log(sort);
    const data = this.rols.slice();
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
    const data = this.rols.slice();
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
