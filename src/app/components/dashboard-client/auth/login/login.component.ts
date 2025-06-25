import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {ReactiveFormsModule,FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen/index';
import { Store } from '@ngrx/store';
import { login } from '../../../../core/store/auth/auth.actions';
import { AuthState } from '../../../../core/store/auth/auth.reducer';
import { Observable } from 'rxjs';
import {CloudinaryModule} from '@cloudinary/ng';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm:FormGroup;
  private loginService = inject(AuthService)
  private toastr = inject(ToastrService)
  private router = inject(Router)
  private store = inject(Store)

  img!: CloudinaryModule
  myWidget!: any;
  constructor(private fb: FormBuilder, private store1: Store<{auth:AuthState}>){
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
      this.store.dispatch(login({email: form.email, password: form.password}));
      // this.loginService.login(form).subscribe(
      //   {
      //     next:(data:unknown|any) => {
      //       console.log(data)
      //       const user ={
      //         id:data.user.id,
      //         nombre: data.user.name,
      //         apellido: data.user.lastname,
      //         rol: data.user.rol
      //       }
      //       console.log(user)
            
      //       localStorage.setItem('User', JSON.stringify(user));
      //       localStorage.setItem('token', data.backendTokens.accessToken);
      //       localStorage.setItem('refreshToken', data.backendTokens.refreshToken);
      //       // console.log('Respuesta del servidor: ', data  );
      //       this.loginService.loggedInSignal.set(true);
            
            
            
      //       this.toastr.success('Inicio de sesión exitoso', 'Exitoso', {
      //         timeOut: 3000,
      //         positionClass: 'toast-top-right'
      //       });
            
      //       // Usamos un retraso para recargar después de que el mensaje se muestra
      //       setTimeout(() => {
      //         this.router.navigate(['/']).then(() => {
      //           window.location.reload();
      //         })
      //       }, 3000); // El tiempo coincide con el `timeOut` del mensaje
      //       },
      //     error: (error:unknown|any) => {
      //       //console.log('Error en la peticion: ', error);
      //       this.toastr.error('Error',error.error.message)
      //     }
      //   }
      // )
    }
  }
}
