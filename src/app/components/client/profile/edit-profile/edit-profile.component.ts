import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  private toastr = inject(ToastrService);
  imageUrl: string | null = null; // Para almacenar el URL de la imagen
 previewUrl: string | null = null;
 imageFile: any = null; // Para almacenar temporalmente la imagen seleccionada
 isDragging = false;
  constructor(private dialogRef: MatDialogRef<EditProfileComponent>, @Inject(MAT_DIALOG_DATA) public data:any){
    console.log(data)
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
  close(){
    this.dialogRef.close();
  }
}
