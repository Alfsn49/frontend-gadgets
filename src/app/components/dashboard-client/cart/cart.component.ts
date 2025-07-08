import { Component, inject } from '@angular/core';
import { CartItemComponent } from "./ui/cart-item/cart-item.component";
import { CartStateService } from '../../../data-access/cart/cart-state.service';
import { ProductItemCart } from '../../../Dto/Product.dto';
import { CartService } from '../../../data-access/cart/cart.service';
import { UserStateService } from '../../../data-access/users/user-state.service';
import { UserService } from '../../../data-access/users/user.service';
import { ToastrService } from 'ngx-toastr';
import { selectCart } from '../../../core/store/cart/cart.selectors';
import { Store } from '@ngrx/store';
import { addToCart, reduceCartItem, removeCartItem } from '../../../core/store/cart/cart.actions';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { verificarCedula } from '../../../utils/validators/cedula-validator.validator';
import { Locations, LocationData } from '../client/address/locations';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ReactiveFormsModule, CartItemComponent, CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  private fb = inject(FormBuilder);
  userService = inject(UserService);
  toastrService = inject(ToastrService);
  store = inject(Store);
  cartData$ = this.store.select(selectCart);
  modalCreateDataClient = false;
  modalCreateDireccion = false;
  createDataClientForm!: FormGroup;
  addressForm!:FormGroup;
  cartService = inject(CartService);
  isSubmitting = false;

  locationData: LocationData = Locations;
    countries: string[] = Object.keys(this.locationData);
    provinces: string[] = [];
    cities: string[] = [];
  addressData: any[] = [];
  addressLoaded = false;
  data$: any;
  userData$:any;
  hasAddress = false;
  // Variables booleanas para el template (evitar llamadas repetidas)
  completePersonalData = false;
  anyAddress = false;

  items = [
  { label: "Masculino", value: "M" },
  { label: "Femenino", value: "F" },
];
 

  constructor(){

    this.cartData$.subscribe(data => {
      console.log('Datos del carrito:', data.items);
      this.data$ = data;
    });
    this.getAddress();
    this.getUserData();
    
    
  }

  validateCedula(control: AbstractControl): { [key: string]: any } | null {
  const cedula = control.value;
  const isValid = verificarCedula(cedula);
  return isValid ? null : { 'cedulaInvalida': true };
}

  getAddress(){
    this.userService.getaddress().subscribe(
      {
        next:(data:any)=>{
          console.log(data)
          this.addressData = data;
          this.addressLoaded = true;
          this.anyAddress = data.length > 0;
          console.log('Direcciones obtenidas:', this.hasAddress);
        },
        error:(error:any)=>{
          this.addressData=[]
          this.addressLoaded = true;
        this.anyAddress = false;
          console.log('Error al obtener las direcciones', this.addressData.length)
          console.log(error)
        }
      }
    )

  }

  getUserData(){
    
    this.userService.verifydataUser().subscribe(
      {
        next:(data:any)=>{
          console.log("Datos del cliente", data)
          this.userData$ = data;
          this.completePersonalData = !!(data?.ci && data?.birthdate && data?.telephone);
        } ,
        error:(error:any)=>{
          this.completePersonalData = false;
          console.log(error)
        }
      }
    )
        
  }

  onRemoveItem(id:any){
    console.log(id.product_id)
    const product_id = id.product_id; // Accedemos al ID a través de id.product
    this.store.dispatch(removeCartItem({product_id:product_id}))
    
  }

  onDecrease(product:any){
    console.log(product)
    const cartItem = {
      product_id: product.product_id,  // Accedemos al ID a través de product.product
      quantity: -1                     // Cantidad a añadir
      
    };
    console.log(cartItem)
    this.store.dispatch(reduceCartItem({ product_id: cartItem.product_id, quantity: cartItem.quantity }));
    // this.state.update({
    //   product:product.product,
    //   quantity:-1
    // })
  }

  onIncrease(product:any){
    console.log(product)
    const cartItem = {
      product_id: product.product_id,  // Accedemos al ID a través de product.product
      quantity: 1                     // Cantidad a añadir
      
    };
    console.log(cartItem)
    this.store.dispatch(addToCart({ product_id: cartItem.product_id, quantity: cartItem.quantity }));
    // this.state.update({
    //   product:product.product,
    //   quantity:1
    // })
  }

  selectAddress(idAddress:string){
    console.log(idAddress)
    this.userService.preferedAddress(idAddress).subscribe(
      {
        next:(data:any)=>{
          console.log(data)
          this.toastrService.success('Dirección seleccionada','Exitoso',{
            timeOut: 3000,
          })
          setTimeout(()=>{
            window.location.reload();
          },5000)
          
        },
        error:(error:any)=>{
          console.log(error)
        }
      }
    )
  }
  hasCompletePersonalData(): boolean {
    console.log('Datos del usuario:', this.userData$);
  return this.userData$?.ci && this.userData$?.birthdate && this.userData$.telephone;
}

hasAnyAddress(): boolean {

  return this.addressLoaded && this.addressData.length > 0;
}

  checkout(){
    console.log('checkout')
    console.log(this.data$)
   
    const direccionesActivas = this.addressData.filter((address:any) => address.activo === true);
  
    const direccionSeleccionada = direccionesActivas[0]; 
    console.log('Dirección seleccionada:', direccionSeleccionada);
    const dataCheckout = {
      
      userId:this.data$.user_id,
      direccionId: direccionSeleccionada.id, // ID de la dirección seleccionada   
      cartId:this.data$.id,
      products:this.data$.items.map((items:any)=>{
      return{
        amount: items.unit_price * 100, // Multiplica por 100 si usas centavos para Stripe
    currency: "usd",
    productId: items.product_id,
    name: items.name,
    image: items.image,
    quantity: items.quantity
      }
    })}
    
    console.log('Datos de checkout:', dataCheckout);
    
    console.log(dataCheckout)
    this.cartService.checkout(dataCheckout).subscribe(
      {
        next:(data:any)=>{
          console.log(data)
          window.location.href = data.url;
        },
        error:(error:any)=>{
          this.toastrService.error(error.error.message, 'Error', {
            timeOut: 3000,
          });
          console.log(error)
        }
      }
    )
  }

  mostrarModal(){
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    
    this.createDataClientForm = this.fb.group({
        ci:['', [Validators.required,this.validateCedula.bind(this)]],
        birthdate:['', [Validators.required]],
        telephone:['', [Validators.required]],
        sexo:['', [Validators.required]],
        userId:[userId],
        });

        this.modalCreateDataClient = !this.modalCreateDataClient
  }

  cerrarModal(){
    this.modalCreateDataClient = !this.modalCreateDataClient
  }

  onSubmitcreateclient(){
    if (this.createDataClientForm.invalid) {
  this.createDataClientForm.markAllAsTouched(); // <- Esto es clave
  return;
}
  // Verificar si el formulario ya está enviando
  this.isSubmitting = true;
// Obtener los valores del formulario
  const formValues = { ...this.createDataClientForm.value };

  // Convertir la fecha de nacimiento a ISO 8601 si existe
  if (formValues.birthdate) {
    // Asegurarse que es una instancia Date, si es string convertirla primero
    const date = new Date(formValues.birthdate);
    formValues.birthdate = date.toISOString(); // ← Aquí se convierte a ISO 8601
  }



  this.userService.createDataUser(formValues).subscribe({
    next:(data:unknown|any)=>{
      this.isSubmitting = false; // Restablecer el estado de envío
      this.toastrService.success('Datos guardados corerctamente');
      window.location.reload();
    },
    error:(error:unknown|any)=>{
      this.isSubmitting = false; // Restablecer el estado de envío
      this.toastrService.error('Error al guardar los datos')
    }
  })
  }
  
  mostrarModaldireccion(){
    this.modalCreateDireccion = !this.modalCreateDireccion
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
    this.locationData = Locations;
      this.countries = Object.keys(this.locationData);
  }

  closeModalDireccion(){
    this.modalCreateDireccion = !this.modalCreateDireccion
  }

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

  onSubmitdireccion(){
    if (this.addressForm.invalid) {
  this.addressForm.markAllAsTouched(); // <- Esto es clave
  return;
}
  this.isSubmitting = true; // Evitar envíos múltiples
  this.userService.createAddress(this.addressForm.value).subscribe({
    next: (data) => {
        console.log(data)
        this.modalCreateDireccion = false;
        this.addressForm.reset();
        this.provinces = [];
        this.cities = [];
        this.isSubmitting = false; // Restablecer el estado de envío
        this.toastrService.success('Dirección creada correctamente', 'Éxito');
        window.location.reload()
      },
      error: (error) => {
        this.isSubmitting = false; // Restablecer el estado de envío
        this.toastrService.error('Error al crear la dirección')
      }
  })

  }
  handleEnterOrSubmitDataClient(controlName: string, nextElement: HTMLElement) {
    const control = this.createDataClientForm.get(controlName);

    if (!control) return;
    
    control.markAsTouched();

    if (control.valid) {
      if (nextElement.tagName.toLowerCase() === 'button') {
        if (this.createDataClientForm.valid) {
          this.onSubmitcreateclient(); // Enviar formulario
        } else {
          this.createDataClientForm.markAllAsTouched(); // Mostrar errores
        }
      } else {
        nextElement.focus(); // Enfocar el siguiente campo
      }
    }
  }

  handleEnterOrSubmitAddress(controlName: string, nextElement: HTMLElement) {
    const control = this.addressForm.get(controlName);

    if (!control) return;
    
    control.markAsTouched();

    if (control.valid) {
      if (nextElement.tagName.toLowerCase() === 'button') {
        if (this.addressForm.valid) {
          this.onSubmitdireccion(); // Enviar formulario
        } else {
          this.addressForm.markAllAsTouched(); // Mostrar errores
        }
      } else {
        nextElement.focus(); // Enfocar el siguiente campo
      }
    }
  }
}

