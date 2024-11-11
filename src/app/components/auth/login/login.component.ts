import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {ReactiveFormsModule,FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm:FormGroup;
  private loginService = inject(AuthService)
  private toastr = inject(ToastrService)
  private router = inject(Router)
  constructor(private fb: FormBuilder){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    })
  }
  
  onSubmit(){
    console.log('Formulario valido: ', this.loginForm.valid);
    if(this.loginForm.valid){
      const form = this.loginForm.value;
      this.loginService.login(form).subscribe(
        {
          next:(data:unknown|any) => {
            console.log(data)
            const user ={
              id:data.user.id,
              nombre: data.user.name,
              apellido: data.user.lastname,
              rol: data.user.rol
            }
            console.log(user)
            localStorage.setItem('User', JSON.stringify(user));
            localStorage.setItem('token', data.backendTokens.accessToken);
            localStorage.setItem('refreshToken', data.backendTokens.refreshToken);
            // console.log('Respuesta del servidor: ', data  );
            this.toastr.success('Inicio de sesion exitoso','Exitoso',{
              timeOut: 3000,
             positionClass: 'toast-top-right'
             });
            
            
             this.router.navigate(['/']);
            },
          error: (error:unknown|any) => {
            //console.log('Error en la peticion: ', error);
            this.toastr.error('Error',error.error.message)
          }
        }
      )
    }
  }
}
