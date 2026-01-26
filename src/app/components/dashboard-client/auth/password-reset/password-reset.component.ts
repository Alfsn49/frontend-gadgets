// password-reset.component.ts (actualizado con isLoading)
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import PasswordValidator from '../../../../utils/validators/password-validator.validator';
import { AuthService } from '../../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  resetPasswordForm!: FormGroup;
  token = '';
  isLoading = false;
  isTokenValid = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.toastr.error('Token no proporcionado', 'Error');
      this.router.navigate(['/']);
      return;
    }

    this.isLoading = true;
    this.authService.tokenResetPassword(this.token).subscribe({
      next: (data: any) => {
        console.log('Token válido:', data);
        this.isTokenValid = true;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Token inválido:', error);
        this.isLoading = false;
        this.isTokenValid = false;
        this.toastr.error('Token inválido o expirado', 'Error');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      }
    });
  }

  constructor() {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), PasswordValidator.passwordStrength]],
      confirmPassword: ['', [Validators.required, PasswordValidator.matchPassword]]
    });
  }

  // Métodos helper para el template
  getPasswordStrengthWidth(): number {
    const password = this.resetPasswordForm.get('password')?.value || '';
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[@$!%*?&]/.test(password)) strength += 20;
    
    return Math.min(strength, 100);
  }

  getPasswordStrengthClass(): string {
    const width = this.getPasswordStrengthWidth();
    if (width < 40) return 'bg-red-500';
    if (width < 60) return 'bg-yellow-500';
    if (width < 80) return 'bg-orange-500';
    return 'bg-emerald-500';
  }

  hasValidation(validationName: string): boolean {
    const password = this.resetPasswordForm.get('password')?.value || '';
    
    switch(validationName) {
      case 'minlength':
        return password.length >= 8;
      case 'hasUpperCase':
        return /[A-Z]/.test(password);
      case 'hasLowerCase':
        return /[a-z]/.test(password);
      case 'hasNumericChar':
        return /[0-9]/.test(password);
      case 'hasSpecialChar':
        return /[@$!%*?&]/.test(password);
      default:
        return false;
    }
  }

  getValidationClass(validationName: string): string {
    const isValid = this.hasValidation(validationName);
    return isValid 
      ? 'bg-emerald-500' 
      : 'bg-gray-300 dark:bg-gray-600';
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid || this.isLoading || !this.isTokenValid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValues = this.resetPasswordForm.value;
    const { confirmPassword, ...data } = formValues;

    console.log('Enviando datos:', data);
    
    this.authService.resertPassword(data, this.token).subscribe({
      next: (response: any) => {
        console.log('Contraseña actualizada:', response);
        this.isLoading = false;
        this.toastr.success('Éxito', response.message || 'Contraseña actualizada correctamente');
        
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error: any) => {
        console.error('Error al cambiar contraseña:', error);
        this.isLoading = false;
        
        let errorMessage = 'Error al cambiar la contraseña';
        if (error.status === 400) {
          errorMessage = 'La contraseña no cumple con los requisitos';
        } else if (error.status === 401) {
          errorMessage = 'Token inválido o expirado';
        } else if (error.status === 429) {
          errorMessage = 'Demasiados intentos. Por favor, espera unos minutos';
        }
        
        this.toastr.error('Error', errorMessage);
      }
    });
  }
}