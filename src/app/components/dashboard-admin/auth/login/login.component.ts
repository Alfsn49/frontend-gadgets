import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { login, loginAdmin } from '../../../../core/store/auth/auth.actions';
import { AuthService } from '../../../../data-access/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectLoading } from '../../../../core/store/auth/auth.selectors';

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
  authService = inject(AuthService);
  store = inject(Store)
  loginLoading = toSignal(this.store.select(selectLoading),
  {
    initialValue: false, 
  })
  constructor(private fb:FormBuilder){
    this.loginFormAdmin = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    })
  }

  onSubmit(){
    console.log(this.loginFormAdmin.value);
    const form = this.loginFormAdmin.value;
    
    this.store.dispatch(loginAdmin({email: form.email, password: form.password}));

    // this.authService.loginAdmin(this.loginFormAdmin.value).subscribe({
    //   next: (response:any) => {
    //     console.log(response);
    //     localStorage.setItem('User', JSON.stringify(response.user));
    //     localStorage.setItem('token', response.backendTokens.accessToken);
    //     localStorage.setItem('refreshToken', response.backendTokens.refreshToken);
    //     localStorage.setItem('isAuthenticated', 'true');
        
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   }
    // })
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
