import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {ReactiveFormsModule,FormGroup, FormBuilder, Validators, FormControlOptions } from '@angular/forms';
import { AuthService } from '../../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AuthStateService } from '../../../../data-access/auth/auth-state.service';
import { Rol } from '../../../../Dto/rol.dto';
import { CustomValidators } from '../../../../utils/validation.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [AuthStateService]
})
export class SignupComponent implements OnInit {
  register: FormGroup; 
  private authService = inject(AuthService)
  private toastr = inject(ToastrService)
  private router = inject(Router)
  private http = inject(HttpClient)
  rol: Rol | null = null;
  img!: any
  myWidget!: any;
  imageUrl: string | null = null; // Para almacenar el URL de la imagen
  previewUrl: string | null = null; 
  imageFile: any = null; // Para almacenar temporalmente la imagen seleccionada
  isDragging = false;    
  constructor(private fb: FormBuilder) {
    
    this.register = this.fb.group({
      name: ['', Validators.required],
      lastname:['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword:['', Validators.required],
      rolId:["",],
      image:['']
    },{
      validator: CustomValidators.MatchingPassword 
    }as FormControlOptions);
  }

  ngOnInit() {
    this.getRol();
   
  }

  getRol(){
     this.authService.getRoles().subscribe((data:Rol)=>{
      console.log(data)
      this.rol = data;
      console.log(this.rol.id)
      this.register.patchValue({ rolId: this.rol.id });
      
    })
  
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

  // Previsualiza la imagen
  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result; // URL base64 generada
    };
    reader.readAsDataURL(file);
    this.imageFile = file;
  }

  // Cuando un archivo es arrastrado dentro de la zona
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files[0]) {
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
  
  async onSubmit() {
  // Primero validamos el formulario
  if (!this.register.valid) {
    this.toastr.error('Por favor completa todos los campos del formulario.', 'Formulario incompleto', {
      timeOut: 3000,
      positionClass: 'toast-top-right',
    });
    return;
  }

  // Luego verificamos si hay imagen
  if (!this.imageFile) {
    this.toastr.error('Por favor selecciona una imagen.', 'Imagen requerida', {
      timeOut: 3000,
      positionClass: 'toast-top-right',
    });
    return;
  }

  try {
    const formData = new FormData();
    const { confirmPassword, ...formValues } = this.register.value;

    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    formData.append('image', this.imageFile);

    await this.authService.signup(formData).subscribe({
      next: () => {
        this.toastr.success('Usuario registrado con éxito', 'Éxito', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
      },
    });
  } catch (error: any) {
    console.error('Error en el registro:', error);
  }
} 
}
