import { Component, inject, ViewChild } from '@angular/core';
import { ClientsService } from '../core/services/clients.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
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
  displayedColumns: string[] = ['name', 'lastname', 'email', 'CI', 'birthdate', 'telephone', 'sexo', 'actions'];

  dataSource= new MatTableDataSource<any>([]);
        sortedData: any[] = [];
        modalCreate = false;
      modalEditar = false;
      modalEliminar = false;
      modalConfirmarEliminar = false;
   createForm: FormGroup;
   editForm: FormGroup;
  previewUrl: string | null = null;
  imageFile: any = null; // Para almacenar temporalmente la imagen seleccionada
  isDragging = false;
  searchText: string = '';
        timeout: any = null;
      
        @ViewChild(MatPaginator) paginator!: MatPaginator;
  clientService = inject(ClientsService)
  clients:any = [];
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  items = [
  { label: "Masculino", value: "M" },
  { label: "Femenino", value: "F" },
];
  constructor(){
    this.getAllClients();
    this.createForm = this.fb.group({
      name:[],
    })

    this.editForm = this.fb.group({
      name: [],
      lastname:[],
      email: [],
      image: [],
      CI: [],
      sexo: [],
      birthdate: [],
      telephone: [],
    });
    
  }
 validateCedula(control: AbstractControl): { [key: string]: any } | null {
  const cedula = control.value;
  const isValid = verificarCedula(cedula);
  return isValid ? null : { 'cedulaInvalida': true };
}
  getAllClients(){
    this.clientService.listAllClients().subscribe({
      next: (response:any) => {
        console.log('Clients fetched successfully:', response);
        this.clients = response.data;
      },
      error: (error:any) => {
        console.error('Error fetching clients:', error);
      }
    })
  }

  previewImage(file:File):void{
  const reader = new FileReader();
  reader.onload = (event:any)=>{
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

mostrarModalEditar(data:any){
  this.modalEditar = true;
  this.editForm.patchValue({
    name: data.name,
    lastname: data.lastname,
    email: data.email,
    image: data.image,
    CI: data.CI,
    sexo: data.sexo,
    birthdate: data.birthdate,
    telephone: data.telephone
  })
}

cerrarModalEditar(){
  this.modalEditar = false;
}

}
