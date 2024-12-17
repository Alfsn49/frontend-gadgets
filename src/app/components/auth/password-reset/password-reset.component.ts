import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import PasswordValidator from '../../../utils/validators/password-validator.validator';
import { AuthService } from '../../../data-access/auth/auth.service';


@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent implements OnInit{

  route = inject(ActivatedRoute)
  router = inject(Router)
  private fb = inject(FormBuilder)
  resetPasswordForm!: FormGroup;
  token=''
  private authService = inject(AuthService)

  ngOnInit(): void {
    
    this.token = this.route.snapshot.queryParamMap.get('token') || ''

    console.log(this.token)
    this.authService.tokenResetPassword(this.token).subscribe(
     {next:(data:unknown|any)=>{
        console.log(data) 
        if(!data){
          console.log('Token invalido')
        }
     },
     error:(error:unknown|any)=>{
      console.error('No hay token:', error);
       this.router.navigate(['/']);
     }
    } 
    )
  }
  constructor(){
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required,Validators.minLength(8), PasswordValidator.passwordStrength]],
      confirmPassword: ['',[Validators.required, PasswordValidator.matchPassword]]
    })
  }

  onSubmit(){
    console.log(this.resetPasswordForm.value)
    const formValues = this.resetPasswordForm.value;

    const {confirmPassword, ...data} = formValues;

    console.log(data)
    this.authService.resertPassword(data, this.token).subscribe((data)=>{
      console.log(data)
    })
  }

}
