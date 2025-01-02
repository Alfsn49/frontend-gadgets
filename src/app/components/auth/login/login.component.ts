import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {ReactiveFormsModule,FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen/index';
import {CloudinaryModule} from '@cloudinary/ng';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,CloudinaryModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm:FormGroup;
  private loginService = inject(AuthService)
  private toastr = inject(ToastrService)
  private router = inject(Router)
  img!: CloudinaryModule;
  myWidget!: any;
  constructor(private fb: FormBuilder){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    })
  }
  ngOnInit(): void {
    const cld = new Cloudinary({
      cloud:{
        cloudName:'dwhexzxkv'
      }
    })
    this.myWidget = (window as any).cloudinary.createUploadWidget({
      cloudName: 'dwhexzxkv',
      uploadPreset: 'ml_default',
    },
    (error:any,result:any)=>{
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info);
        document.getElementById("uploadedimage")?.setAttribute("src", result.info.secure_url);
      }
    }
  )
  }
  openWidget(){
    this.myWidget.open();
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
            this.loginService.loggedInSignal.set(true);
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
