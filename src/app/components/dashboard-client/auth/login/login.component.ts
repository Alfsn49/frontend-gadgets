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
import { toSignal } from '@angular/core/rxjs-interop';
import { selectLoading } from '../../../../core/store/auth/auth.selectors';

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
  loginLoading = toSignal(this.store.select(selectLoading),
{
  initialValue: false, 
})

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
  handleEnterOrSubmit(controlName: string, nextElement: HTMLElement) {
  const control = this.loginForm.get(controlName);

  if (!control) return;

  control.markAsTouched();

  if (control.valid) {
    if (nextElement.tagName.toLowerCase() === 'button') {
      if (this.loginForm.valid) {
        this.onSubmit(); // Enviar formulario
      } else {
        this.loginForm.markAllAsTouched(); // Mostrar errores
      }
    } else {
      nextElement.focus(); // Enfocar el siguiente campo
    }
  }
}

  onSubmit(){
    console.log('Formulario valido: ', this.loginForm.valid);
    if(this.loginForm.valid){
      const form = this.loginForm.value;
      this.store.dispatch(login({email: form.email, password: form.password}));
      
    }
  }
}
