import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

  router = inject(Router)
  private fb = inject(FormBuilder)
  requestPassword!: FormGroup;
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  constructor() { 
    this.requestPassword = this.fb.group({
      email: ['',[Validators.required, Validators.email]]
    })
  }

  onSubmit(){
    console.log(this.requestPassword.value)
    this.authService.requestResetPassword(this.requestPassword.value).subscribe(
      {next:(data:unknown|any)=>{
        console.log(data)
        this.toastr.success('Se ha enviado un correo para restablecer la contraseña')
        this.router.navigate(['auth/login'])
      },
      error:(error:unknown|any)=>{
        console.error('Error al solicitar el cambio de contraseña:', error);
        this.toastr.error('Error al solicitar el cambio de contraseña')
      }
    }
    )
  }

}
