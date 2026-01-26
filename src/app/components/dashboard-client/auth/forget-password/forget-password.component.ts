import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit{

  router = inject(Router)
  private fb = inject(FormBuilder)
  requestPassword!: FormGroup;
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  isLoading = false; // ✅ Variable de estado de carga
  isSubmitted = false; // ✅ Para mostrar mensaje de éxito
  constructor() { 
    this.requestPassword = this.fb.group({
      email: ['',[Validators.required, Validators.email]]
    })
  }
  ngOnInit(): void {
    
  }
  onSubmit() {
    if (this.requestPassword.invalid || this.isLoading) {
      this.requestPassword.markAllAsTouched();
      return;
    }

    this.isLoading = true; // ✅ Activar estado de carga
    console.log(this.requestPassword.value);
    
    this.authService.requestResetPassword(this.requestPassword.value).subscribe({
      next: (data: any) => {
        console.log(data);
        this.isLoading = false; // ✅ Desactivar carga
        this.isSubmitted = true; // ✅ Mostrar estado de éxito
        
        this.toastr.success('Se ha enviado un correo para restablecer la contraseña');
        
        // Opcional: Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['auth/login']);
        }, 3000);
      },
      error: (error: any) => {
        console.error('Error al solicitar el cambio de contraseña:', error);
        this.isLoading = false; // ✅ Desactivar carga en caso de error
        
        let errorMessage = 'Error al solicitar el cambio de contraseña';
        if (error.status === 404) {
          errorMessage = 'No se encontró una cuenta con este correo';
        } else if (error.status === 429) {
          errorMessage = 'Demasiados intentos. Por favor, espera unos minutos';
        }
        
        this.toastr.error(errorMessage);
      }
    });
  }

}
