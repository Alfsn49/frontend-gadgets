import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginFormAdmin: FormGroup;
  passwordVisible: boolean = false;
  constructor(private fb:FormBuilder){
    this.loginFormAdmin = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    })
  }

  onSubmit(){}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
