import { Component, inject, ViewChild } from '@angular/core';
import { ClientsService } from '../core/services/clients.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { verificarCedula } from '../../../utils/validators/cedula-validator.validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  displayedColumns: string[] = ['ci', 'name', 'lastname', 'email', 'image', 'birthdate', 'telephone', 'sexo', 'actions'];

  dataSource = new MatTableDataSource<any>([]);
  sortedData: any[] = [];
  modalCreate = false;
  modalEditar = false;
  modalEliminar = false;
  modalConfirmarEliminar = false;
  userId: any;
  createForm: FormGroup;
  editarForm: FormGroup;
  previewUrl: string | null = null;
  imageFile: any = null; // Para almacenar temporalmente la imagen seleccionada
  isDragging = false;
  searchText: string = '';
  timeout: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  clientService = inject(ClientsService)
  clients: any = [];
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  items = [
    { label: "Masculino", value: "M" },
    { label: "Femenino", value: "F" },
  ];
  constructor() {

    this.createForm = this.fb.group({
      name: [],
    })

    this.editarForm = this.fb.group({
      name: [],
      lastname: [],
      email: [],
      image: [],
      ci: ['', [this.validateCedula.bind(this)]],
      sexo: [],
      birthdate: [],
      telephone: [],
    });
    this.getAllClients();
  }
  validateCedula(control: AbstractControl): { [key: string]: any } | null {
    const cedula = control.value;
    const isValid = verificarCedula(cedula);
    return isValid ? null : { 'cedulaInvalida': true };
  }

  getAllClients() {
    this.clientService.listAllClients().subscribe({
      next: (response: any) => {
        console.log('Clients fetched successfully:', response);
        this.clients = response;
        this.feedDataSource(this.clients)
      },
      error: (error: any) => {
        console.error('Error fetching clients:', error);
      }
    })
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.previewUrl = event.target.result;
    };
    reader.readAsDataURL(file);
    this.imageFile = file;
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.previewImage(files[0]);
    }
  }

  // Cuando un archivo está siendo arrastrado dentro de la zona
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  // Cuando el archivo deja de ser arrastrado
  onDragLeave(event: DragEvent): void {
    this.isDragging = false;
  }
  // Cuando un archivo es seleccionado desde el input
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validación de tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Por favor selecciona un archivo de imagen', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
        return;
      }
      // Validación de tamaño de archivo (por ejemplo, 5 MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error('El archivo es demasiado grande. El límite es 5 MB.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
        return;
      }

      this.previewImage(file);
    }
  }

  openModalEdit(data: any) {
    this.modalEditar = true;
    const formattedDate = data.birthdate
      ? new Date(data.birthdate).toISOString().split('T')[0]
      : '';
    this.userId = data.id
    this.editarForm.patchValue({
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      image: data.image,
      ci: data.ci,
      sexo: data.sexo,
      birthdate: formattedDate,
      telephone: data.telephone
    })
    this.previewUrl = data.image;
  }

  closeModalEdit() {
    this.modalEditar = false;
    this.editarForm.reset();
    this.userId = ""
    this.imageFile = null;
  }

  onSubmitEdit() {
    console.log(this.editarForm.value)
    console.log('Id del usuario: ', this.userId)

    if (this.editarForm.invalid) {
      this.toastr.error('Hay campos vacios o con errores')
      return
    }

    const fechaStr = this.editarForm.value.birthdate; // "2025-06-24"
    const fechaISO = new Date(fechaStr).toISOString(); // "2025-06-24T00:00:00.000Z"
    console.log(fechaISO)
    const formData = new FormData();
    formData.append('name', this.editarForm.value.name);
    formData.append('lastname', this.editarForm.value.lastname);
    formData.append('email', this.editarForm.value.email);
    formData.append('ci', this.editarForm.value.ci);
    formData.append('birthdate', fechaISO);
    formData.append('telephone', this.editarForm.value.telephone);
    formData.append('sexo', this.editarForm.value.sexo);

    if (this.imageFile) {
      // Si se seleccionó una nueva imagen, la añadimos
      formData.append('image', this.imageFile);
    } else if (this.previewUrl) {
      // Si no hay nueva imagen, añadimos la URL actual
      formData.append('image', this.previewUrl);
    }
    // Forma 1: Iterar sobre el contenido del FormData
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    this.clientService.updateClients(formData, this.userId).pipe().subscribe({
      next: (data: unknown | any) => {
        console.log(data);
        this.toastr.success('Perfil actualizado');
        this.getAllClients()
        this.closeModalEdit()
      },
      error: (error: unknown | any) => {
        console.log('Error al actualizar el perfil: ', error);
        this.toastr.error('Error al actualizar el perfil');
      }
    })
  }

  openModalCreate() {

  }

  closeModalCreate() {

  }

  onSubmitCreate() {

  }

  openModalDelete(id: any) { 
    this.userId = id;
    this.modalEliminar = ! this.modalEliminar
  }

  closeModalDelete() { 
    this.modalEliminar = !this.modalEliminar
  }

  openModalConfirmDelete() { 
    this.modalConfirmarEliminar = !this.modalConfirmarEliminar
  }

  closeModalConfirmDelete() { 
    this.modalConfirmarEliminar = !this.modalConfirmarEliminar
  }

  onSubmitDelete() { 

    this.clientService.deleteClients(this.userId).pipe().subscribe({
      next:(data:unknown|any)=>{
        console.log(data)
        this.toastr.success("Clientes Eliminados")
        this.closeModalConfirmDelete()
        this.closeModalDelete()
        this.getAllClients()
      },
      error:(error:unknown|any)=>{
        console.log(error)
        this.toastr.error("Error al eliminar el cliente")
      }
    })
  }

  feedDataSource(data: any) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
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
    const data = this.clients.slice();
    if (!search) {
      this.feedDataSource(data);
      return;
    }

    const dataFiltered = data.filter((item: any) => {
      return item.name.includes(search);
    });

    this.feedDataSource(dataFiltered);
  }

  sortData(sort: Sort) {
    console.log(sort);
    const data = this.clients.slice();
    if (!sort.active || sort.direction === '') {
      this.feedDataSource(data);
      return;
    }
    const sortedData = data.sort((a: any, b: any) => {
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


}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

