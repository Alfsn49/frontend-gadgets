import { Component, effect, inject } from '@angular/core';
import { UserStateService } from '../../../../data-access/users/user-state.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../data-access/users/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Locations, LocationData } from './locations';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-address',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})

export class AddressComponent {

  idAddress: any = null;
  getaddress:any = [];
  locationData: LocationData = Locations;
  countries: string[] = Object.keys(this.locationData);
  provinces: string[] = [];
  cities: string[] = [];
  bandera = false;
  addressForm: FormGroup;
  modalCreate = false;
  modalEdit = false;
  modalDelete = false;
  modalConfirmDelete = false;
  fb = inject(FormBuilder);
  createAddress:any;
  editAddressForm: FormGroup;
  userService = inject(UserService);
  toastr = inject(ToastrService);


  loadProvinces(): void {
    const selectedCountry = this.addressForm.get('pais')?.value;
    if (selectedCountry && this.locationData[selectedCountry]) {
      this.provinces = Object.keys(this.locationData[selectedCountry]);
      this.addressForm.get('estado')?.reset();
      this.addressForm.get('estado')?.enable(); // ✅ Habilitar provincia
      this.cities = [];
      this.addressForm.get('ciudad')?.reset();
      this.addressForm.get('ciudad')?.disable(); // ❌ Asegurar ciudad deshabilitada
    } else {
      this.provinces = [];
      this.addressForm.get('estado')?.disable();
      this.cities = [];
      this.addressForm.get('ciudad')?.disable();
    }
  }

  loadCities(): void {
    const selectedCountry = this.addressForm.get('pais')?.value;
    const selectedProvince = this.addressForm.get('estado')?.value;
  
    if (
      selectedCountry &&
      selectedProvince &&
      this.locationData[selectedCountry]?.[selectedProvince]
    ) {
      this.cities = this.locationData[selectedCountry][selectedProvince];
      this.addressForm.get('ciudad')?.reset();
      this.addressForm.get('ciudad')?.enable(); // ✅ Habilitar ciudad
    } else {
      this.cities = [];
      this.addressForm.get('ciudad')?.disable(); // ❌ Deshabilitar si no hay datos válidos
    }
  }

  // Cargar provincias al cambiar el país
loadProvincesEdit(): void {
  const selectedCountry = this.editAddressForm.get('pais')?.value;

  if (selectedCountry && this.locationData[selectedCountry]) {
    this.provinces = Object.keys(this.locationData[selectedCountry]);
    console.log(this.provinces)
   

    
  } 
}

// Cargar ciudades al cambiar la provincia
loadCitiesEdit(): void {
  const selectedCountry = this.editAddressForm.get('pais')?.value;
  const selectedProvince = this.editAddressForm.get('estado')?.value;

  if (selectedCountry && selectedProvince && this.locationData[selectedCountry]?.[selectedProvince]) {
    this.cities = this.locationData[selectedCountry][selectedProvince];
    this.editAddressForm.get('ciudad')?.enable(); // Habilitar 'ciudad' cuando hay datos disponibles
  } 
}
  


  constructor(private dialog: MatDialog){
    this.addressForm = this.fb.group({
      callePrincipal:['', Validators.required],
      calleSecundaria:['',Validators.required],
      referencia:['',Validators.required],
      numero:['', Validators.required],
      codigoPostal:['',Validators.required],
      ciudad: [{ value: '', disabled: true }, Validators.required],
  estado: [{ value: '', disabled: true }, Validators.required],
      pais:['',Validators.required],
      activo:[false,Validators.required]
    })
    this.editAddressForm = this.fb.group({
      "id": [],
      "callePrincipal": [],
      "calleSecundaria": [],
      "referencia": [],
      "numero": [],
      "codigoPostal": [],
      "ciudad": [],
      "estado": [],
      "pais": [],
      "activo": []
    });
    this.locationData = Locations;
  this.countries = Object.keys(this.locationData);
  this.editAddressForm.get('pais')?.valueChanges.subscribe(() => {
    this.loadProvincesEdit();
  });

  this.editAddressForm.get('estado')?.valueChanges.subscribe(() => {
    this.loadCitiesEdit();
  });
  this.getAddress()
  }

  getAddress(){
    this.userService.getaddress().subscribe(
      {
        next: (data) => {
          console.log(data)
          this.getaddress = data;
        },
        error: (error) => {
          console.error('Error al obtener la dirección:', error);
        }
      }
    )
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
    this.userService.createAddress(this.addressForm.value).subscribe({
      next: (data) => {
        console.log(data)
        this.modalCreate = false;
        this.addressForm.reset();
        this.provinces = [];
        this.cities = [];
        this.toastr.success('Dirección creada correctamente', 'Éxito');
        this.getAddress(); // Actualiza la lista de direcciones después de crear una nueva
      },
      error: (error) => {
        console.error('Error al crear la dirección:', error);
      }
    })
    
  }

  openModalCreate() {
    this.modalCreate = true;
    
    console.log(this.addressForm.value)
  }

  closeModalCreate() {
    this.modalCreate = false;
    this.addressForm.reset();
    this.provinces = [];
    this.cities = [];

    }

    openModalEdit(data: any) {
      console.log(data);
      this.modalEdit = true;
      // Verifica que exista el país
      if (this.locationData[data.pais]) {
        this.provinces = Object.keys(this.locationData[data.pais]);
        
        // Normaliza el estado para encontrar la clave real
        const provinciaFormValue = this.provinces.find(
          p => p === data.estado
          
        );
        
        if (provinciaFormValue && this.locationData[data.pais][provinciaFormValue]) {
          console.log('Valor a setear:', provinciaFormValue);
          console.log('Provincias disponibles:', this.provinces);
    
          this.cities = this.locationData[data.pais][provinciaFormValue];
    
          this.editAddressForm.patchValue({
            "id": data.id,
            "callePrincipal": data.callePrincipal,
            "calleSecundaria": data.calleSecundaria,
            "referencia": data.referencia,
            "numero": data.numero,
            "codigoPostal": data.codigoPostal,
            "ciudad": data.ciudad,
            "estado": provinciaFormValue, // usamos el valor real del select
            "pais": data.pais,
            "activo": data.activo
          });
        } else {
          console.error('Provincia no válida');
        }
      } else {
        console.error('País no válido');
      }
    }
    
    

  closeModalEdit() {
    this.modalEdit = false;
    this.editAddressForm.reset();
    this.provinces = [];
    this.cities = [];
  }

    onSubmitEdit() {
      console.log(this.editAddressForm.value)
      this.userService.editAddress(this.editAddressForm.value).subscribe(
        {
          next: (data) => {
            console.log(data)
            this.modalEdit = false;
            this.editAddressForm.reset();
            this.provinces = [];
            this.cities = [];
            this.toastr.success('Dirección editada correctamente', 'Éxito');
            this.getAddress(); // Actualiza la lista de direcciones después de editar
          },
          error: (error) => {
            console.error('Error al editar la dirección:', error);
          }
        }
      )
    }

  openModalDelete(data:any){
    this.modalDelete = true;
    this.idAddress = data ;
    console.log(this.idAddress)
  }

  closeModalDelete() {
    this.modalDelete = false;
  }

  openModalConfirmDelete(){
    this.modalConfirmDelete = true;
  }

  closeModalConfirmDelete() {
    this.modalConfirmDelete = false;
  }

  onSubmitDelete(){
    console.log(this.idAddress)
    this.userService.deleteAddress(this.idAddress).subscribe(
      {
        next: (data) => {
          console.log(data)
          this.modalDelete = false;
          this.modalConfirmDelete = false;
          this.toastr.success('Dirección eliminada correctamente', 'Éxito');
          this.getAddress(); // Actualiza la lista de direcciones después de eliminar
        },
        error: (error) => {
          console.error('Error al eliminar la dirección:', error);
        }
      }
    )
  }

  
}
