import { Component, inject } from '@angular/core';
import { UserService } from '../../../../data-access/users/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private userService = inject(UserService);

  private fb = inject(FormBuilder)
  profileForm: FormGroup;
  toast = inject(ToastrService)
  userData:any;

  constructor(){
    
    this.profileForm = this.fb.group({
      name:['',[Validators.required]],
      lastname:[[Validators.required]],
      email: [[Validators.required, Validators.email]]
    })
    this.getProfile()
  }

  getProfile(){
    this.userService.profileAdmin().subscribe({
      next:(data:any)=>{
        console.log(data)
        this.userData = data
        this.profileForm.patchValue({
          name: data.name,
          lastname: data.lastname,
          email: data.email,
        });
      },
      error:(error:any)=>{
        console.log(error)
      }
    })
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.toast.warning('Por favor, completa los campos correctamente');
      return;
    }

    const updatedData = this.profileForm.value;

    // Aquí puedes llamar a tu endpoint de actualización:
    // this.userService.updateProfile(updatedData).subscribe({
    //   next: () => {
    //     this.toast.success('Perfil actualizado correctamente');
    //   },
    //   error: (err:any) => {
    //     console.error(err);
    //     this.toast.error('No se pudo actualizar el perfil');
    //   }
    // });
  }
  
}
