import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {ReactiveFormsModule,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../data-access/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AuthStateService } from '../../../data-access/auth/auth-state.service';
import { Rol } from '../../../Dto/rol.dto';
import { CustomValidators } from '../../../utils/validation.service';
import { Router } from '@angular/router';

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
  rol: Rol | null = null;
  constructor(private fb: FormBuilder) {
    
    this.register = this.fb.group({
      name: ['', Validators.required],
      lastname:['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword:['', Validators.required],
      rolId:["",]
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
      console.log(this.rol)
      this.register.patchValue({ rolID: this.rol.id });
    })
  
  }
  

  onSubmit(){
    console.log('Registro valido: ', this.register.valid);
    console.log('Form Data: ', this.register.value);
    const form = this.register.value;
    delete form.confirmPassword;
    
    
    if(this.register.valid){
      console.log('Form Data: ', form);
      this.authService.signup(form).subscribe({
        next:(data)=>{ console.log(data);
          this.toastr.success('Usuario registrado con éxito', 'Éxito', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
          this.router.navigate(['/login']);
        },
        error:(data)=>{ console.log('Error: ', data);
          this.toastr.error(data.error.message, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        },
        complete:()=>{ console.log('Completado');}
      })
    }

    
  }
}
