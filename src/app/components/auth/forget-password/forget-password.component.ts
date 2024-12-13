import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  constructor() { 
    this.requestPassword = this.fb.group({
      email: ['',[Validators.required, Validators.email]]
    })
  }

  onSubmit(){
    console.log(this.requestPassword.value)
  }

}
