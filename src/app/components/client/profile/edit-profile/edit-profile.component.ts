import { Component, inject, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { verificarCedula } from '../../../../utils/validators/cedula-validator.validator';
import { UserService } from '../../../../data-access/users/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  private fb = inject(FormBuilder);
  profileEditForm:FormGroup;
  private toastr = inject(ToastrService);
  private userService = inject(UserService);
  imageUrl: string | null = null; // Para almacenar el URL de la imagen
 previewUrl: string | null = null;
 imageFile: any = null; // Para almacenar temporalmente la imagen seleccionada
 isDragging = false;
  constructor(private dialogRef: MatDialogRef<EditProfileComponent>, @Inject(MAT_DIALOG_DATA) public data:any){
    console.log(data)
    this.profileEditForm = this.fb.group({
      name: [data.nombre, [Validators.required]],
      lastname: [data.apellido, [Validators.required]],
      email:[data.email, [Validators.required, Validators.email]],
      image:[data.image, [Validators.required]],
      CI:[data.cedula, [Validators.required,this.validateCedula.bind(this)]],
      birthdate:[data.birthdate, [Validators.required]],
      telephone:[data.telefono],
    });
    this.previewUrl = data.image;
  }

  validateCedula(control: AbstractControl): { [key: string]: any } | null {
    const cedula = control.value;
    const isValid = verificarCedula(cedula);
    return isValid ? null : { 'cedulaInvalida': true };
  }

  previewImage(file:File):void{
    const reader = new FileReader();
    reader.onload = (event:any)=>{
      this.previewUrl = event.target.result;
    };
    reader.readAsDataURL(file);
    this.imageFile = file;
    console.log(this.imageFile)
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
  
  close(){
    this.dialogRef.close();
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

 this.userService.editProfile(formData).subscribe({
    next:(data:unknown|any)=>{
      console.log(data)
      this.toastr.success('Perfil actualizado con éxito');
      this.dialogRef.close(data);
      // Agregar un pequeño retraso para asegurar que el mensaje de éxito se muestra antes de recargar
    setTimeout(() => {
      location.reload(); // Reinicia la página
    }, 500); // 500ms es suficiente para que el toastr se vea
    },
    error:(error:unknown|any)=>{
      console.error('Error al actualizar el perfil:', error);
      this.toastr.error('Error al actualizar el perfil');
    }
  });
    //this.dialogRef.close(this.profileEditForm.value);
  }
}
