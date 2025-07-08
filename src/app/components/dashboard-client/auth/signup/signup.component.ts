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
import PasswordValidator from '../../../../utils/validators/password-validator.validator';

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
  isSubmitted = false; // Para controlar el estado del formulario    
  constructor(private fb: FormBuilder) {
    
    this.register = this.fb.group({
      name: ['', Validators.required],
      lastname:['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), PasswordValidator.passwordStrength]],
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

  handleEnterOrSubmit(controlName: string, nextElement: HTMLElement) {
    const control = this.register.get(controlName);

    if (!control) return;
    
    control.markAsTouched();

    if (control.valid) {
      if (nextElement.tagName.toLowerCase() === 'button') {
        if (this.register.valid) {
          this.onSubmit(); // Enviar formulario
        } else {
          this.register.markAllAsTouched(); // Mostrar errores
        }
      } else {
        nextElement.focus(); // Enfocar el siguiente campo
      }
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
  this.isSubmitted = true; // Marcar el formulario como enviado
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
        this.isSubmitted = false; // Marcar el formulario como enviado
        this.toastr.success('Usuario registrado con éxito', 'Éxito', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isSubmitted = false; // Marcar el formulario como no enviado en caso de error
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
