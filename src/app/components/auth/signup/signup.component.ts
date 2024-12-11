import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {ReactiveFormsModule,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AuthStateService } from '../../../data-access/auth/auth-state.service';
import { Rol } from '../../../Dto/rol.dto';
import { CustomValidators } from '../../../utils/validation.service';
import { Router } from '@angular/router';
import {CloudinaryModule} from '@cloudinary/ng';
import { Cloudinary } from '@cloudinary/url-gen/index';
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
  img!: CloudinaryModule;
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
    });
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
    if (this.register.valid && this.imageFile) {
      try {
        // Primero, sube la imagen al backend
        const uploadResponse: any = await this.authService.uploadImage(this.imageFile).toPromise();
        console.log(uploadResponse);
        const imageUrl = uploadResponse.imageUrl; // URL de la imagen devuelta por el backend
        console.log('Imagen subida:', imageUrl);
  
        // Crear el objeto de datos del formulario con la URL de la imagen
        const formData = { ...this.register.value, image: imageUrl };
        delete formData.confirmPassword; // Eliminar confirmación de contraseña antes de enviar
  
        // Registrar al usuario en el backend
        await this.authService.signup(formData).toPromise();
  
        // Notificar éxito y redirigir al login
        this.toastr.success('Usuario registrado con éxito', 'Éxito', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
        this.router.navigate(['/auth/login']);
      } catch (error) {
        this.toastr.error('Error al registrar al usuario', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
        console.error(error);
      }
    } else {
      this.toastr.error('Por favor completa todos los campos.', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
    }
  }
  
  

  // Subir la imagen a Cloudinary
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'demo123'); // Ajusta tu upload preset
    //formData.append('folder', 'users');

    try {
      // No añadimos el header de Authorization y dejamos que la API de Cloudinary maneje la autorización internamente.
    const data: any = await this.http.post('https://api.cloudinary.com/v1_1/dwhexzxkv/image/upload', formData).toPromise();
      return data.secure_url; // URL segura de la imagen subida
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw new Error('No se pudo subir la imagen.');
    }
  }
  
}
