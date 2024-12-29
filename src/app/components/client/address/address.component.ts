import { Component, effect, inject } from '@angular/core';
import { UserStateService } from '../../../data-access/users/user-state.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../data-access/users/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {
  getaddress = inject(UserStateService).getAddress()
  bandera = false;
  addressForm: FormGroup;
  fb = inject(FormBuilder);
  createAddress:any;
  userService = inject(UserService);
  constructor(private dialog: MatDialog){
    this.addressForm = this.fb.group({
      calle_principal:['', Validators.required],
      calle_secundaria:['',Validators.required],
      referencia:['',Validators.required],
      numero:['', Validators.required],
      codigo_postal:['',Validators.required],
      ciudad:['',Validators.required],
      estado:['',Validators.required],
      pais:['',Validators.required],
      activo:[false,Validators.required]
    })
  }

  activate(){
    this.bandera = !this.bandera;
  }

  openModal(data:any){
    console.log(data)  
    this.dialog.open(EditAddressComponent,{
      data: data  // Pasa la dirección seleccionada
    })
  }

  onSubmit(){
    console.log(this.addressForm.value);
    this.userService.createAddress(this.addressForm.value).subscribe((data)=>{
        const currentadrress = this.getaddress()
        console.log(data)
        console.log('Dirección creada',currentadrress)
        window.location.reload()
    })
    
  }
}
