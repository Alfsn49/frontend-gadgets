import { Component, inject } from '@angular/core';
import { UserStateService } from '../../../data-access/users/user-state.service';
import { AbstractControl, Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { name } from '@cloudinary/url-gen/actions/namedTransformation';
import { last } from 'rxjs';
import { image } from '@cloudinary/url-gen/qualifiers/source';
import { UserService } from '../../../data-access/users/user.service';
import { verificarCedula } from '../../../utils/validators/cedula-validator.validator';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
 private fb = inject(FormBuilder);
 userService = inject(UserStateService).loadUsers();
 private ServiceUser = inject(UserService);
 userEditForm:FormGroup;
 createDataClientForm: FormGroup;
 profileEditForm:FormGroup;
 activeForm = false;
 modalCreateDataClient = false;
 modalEditProfile = false;
 private userdata = localStorage.getItem('User');
 private userId = this.userdata ? JSON.parse(this.userdata).id : null;
 private toastr = inject(ToastrService);
 imageUrl: string | null = null; // Para almacenar el URL de la imagen
 previewUrl: string | null = null;
 imageFile: any = null; // Para almacenar temporalmente la imagen seleccionada
 isDragging = false;


 items = [
  { label: "Masculino", value: "M" },
  { label: "Femenino", value: "F" },
];
 

 constructor(private dialog: MatDialog){
  this.userEditForm = this.fb.group({
  name: ['', [Validators.required]],
  lastname: ['', [Validators.required]],
  email:['', [Validators.required, Validators.email]],
  image:[''],
  CI:[''],
  birthdate:[''],
  telephone:[''],
  });

  this.createDataClientForm = this.fb.group({
    CI:['', [Validators.required,this.validateCedula.bind(this)]],
    birthdate:['', [Validators.required]],
    telephone:['', [Validators.required]],
    sexo:['', [Validators.required]],
    userId:[this.userId,],
    });
  
  this.profileEditForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email:['', [Validators.required, Validators.email]],
    image:[''],
    CI:[''],
    birthdate:[''],
    telephone:[''],
  });
 }
 validateCedula(control: AbstractControl): { [key: string]: any } | null {
  const cedula = control.value;
  const isValid = verificarCedula(cedula);
  return isValid ? null : { 'cedulaInvalida': true };
}

getProfile(){
  this.ServiceUser.profile().subscribe({
    next:(data:unknown|any)=>{
      console.log(data)
      this.userEditForm.patchValue({
        name: data.nombre,
        lastname: data.apellido,
        email:data.email,
        image:data.image,
        CI:data.cedula,
        birthdate:this.formatDate(data.birthdate),
        telephone:data.telefono,
      })
      this.previewUrl = data.image;
    },
    error:(error:unknown|any)=>{
      console.error('Error al obtener los datos del perfil', error);
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

 dataclientcreate(){
  console.log(this.createDataClientForm.value)

  this.ServiceUser.createDataUser(this.createDataClientForm.value).subscribe({
    next:(data:unknown|any)=>{
      console.log(data)
      this.toastr.success('Datos guardados correctamente')
      window.location.reload();
    },
    error:(error:unknown|any)=>{
      console.error('Error al guardar los datos', error);
      this.toastr.error('Error al guardar los datos')
    }
  }
  )
 }


 formatDate(isoDate: string): string {
  return isoDate ? isoDate.split('T')[0] : ''; // Extrae solo YYYY-MM-DD
}
 openModal(data:any){
  console.log(data)
  this.dialog.open(EditProfileComponent,{
    data: data,
    width: '50%', // Ajusta al 80% del ancho del viewport
    height: '100%', // Ajusta al 90% del alto del viewport
    maxWidth: '100vw', // Permite que use todo el ancho si es necesario
    maxHeight: '100vh' // Permite que use todo el alto si es necesario
  })
 }
 changeValue(){
  this.activeForm = !this.activeForm;
 }

 mostrarModal(){
  this.modalCreateDataClient = !this.modalCreateDataClient;
 }

 cerrarModal(){
  this.modalCreateDataClient = false;
 }
  mostrarModalEditProfile(){
    this.modalEditProfile = !this.modalEditProfile;
    this.getProfile();
  }
  cerrarModalEditProfile(){
    this.modalEditProfile = false;
  }

  async onSubmit(){
    console.log(this.profileEditForm.value)
    const formData = new FormData();
    formData.append('name', this.profileEditForm.value.name);
    formData.append('lastname', this.profileEditForm.value.lastname);
    formData.append('email', this.profileEditForm.value.email);
    formData.append('CI', this.profileEditForm.value.CI);
    formData.append('birthdate', this.profileEditForm.value.birthdate);
    formData.append('telephone', this.profileEditForm.value.telephone);

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

 this.ServiceUser.editProfile(formData).subscribe({
    next:(data:unknown|any)=>{
      console.log(data)
      this.toastr.success('Perfil actualizado con éxito');
     
      
      // Agregar un pequeño retraso para asegurar que el mensaje de éxito se muestra antes de recargar
      window.location.reload();
    },
    error:(error:unknown|any)=>{
      console.error('Error al actualizar el perfil:', error);
      this.toastr.error('Error al actualizar el perfil');
    }
  });
    //this.dialogRef.close(this.profileEditForm.value);
  }
}
