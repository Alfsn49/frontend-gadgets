import { Component, inject, ViewChild } from '@angular/core';
import { OrdersService } from '../core/services/orders.service';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EstadoPagoPipe } from './pipe/estado-pago.pipe';

@Component({
  selector: 'app-orders',
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
    EstadoPagoPipe
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  displayedColumns: string[] = ['id', 'nombre', 'apellido',"email","ciudad", 'direccion',"estado_envio", "estado_pago", "total", 'actions'];
  dataSource = new MatTableDataSource<any>([]);
    sortedData: any[] = [];
  
    dtElement!: DataTableDirective;
    modalCreate = false;
    modalEditar = false;
    modalEliminar = false;
    modalConfirmarEliminar = false;

    editarForm!: FormGroup;
  
    fb = inject(FormBuilder);
    catalogService = inject(OrdersService);
    toastr = inject(ToastrService);

    orders: any[] = [];
    idOrder: any = null;

    estadoEnviado: boolean = false;

    searchText: string = '';
      timeout: any = null;
    
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor (){
      this.editarForm = this.fb.group({
        estado: [""],
      });
      this.listOrders();
    }
    
    listOrders(){
      this.catalogService.listOrders().subscribe({
        next: (res: any) => {
          console.log(res);
          this.orders = res;
          this.dataSource = new MatTableDataSource<any>(this.orders);
          this.dataSource.paginator = this.paginator;
          this.sortedData = this.orders.slice();
        }
        , error: (err: any) => {
          this.toastr.error('Error al cargar las órdenes', 'Error');
          console.error(err);
        }
      });
    }

    openModalCreate(){

    }
    openModalEdit(order: any){
      this.modalEditar = true;
      // Convertir 'enviado' => true, 'procesando' => false
    const estadoBooleano = order.estado?.toLowerCase() === 'enviado';
    console.log('Estado booleano:', estadoBooleano);
      this.editarForm.patchValue({
        estado: estadoBooleano
      });
      console.log(order);
    }

    onSubmitEdit() {
      console.log(this.editarForm.value);
      const rawValue = this.editarForm.value;

  const estadoFormateado = rawValue.estado ? 'enviado' : 'procesando';

  const dataAEnviar = {
    ...rawValue,
    estado: estadoFormateado
  };

  console.log('Datos a enviar:', dataAEnviar);
    }

    closeModalEdit(){}
    openModalDelete(order:any){}
    feedDataSource(data: any) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }
  
    sortData(sort: Sort) {
      console.log(sort);
      const data = this.orders.slice();
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
    const data = this.orders.slice();
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
