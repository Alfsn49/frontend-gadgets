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
import { selectRole } from '../../../core/store/auth/auth.selectors';
import { map } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  //getaddress = inject(UserStateService).getAddress()
  userService = inject(UserService);
  toastrService = inject(ToastrService);
  store = inject(Store);
  cartData$ = this.store.select(selectCart);
  cartService = inject(CartService);
  addressData: any = null;
  
  data$: any;
  
  constructor(){

    this.cartData$.subscribe(data => {
      console.log('Datos del carrito:', data.items);
      this.data$ = data;
    });
    this.getAddress();
  }

  getAddress(){
    this.userService.getaddress().subscribe(
      {
        next:(data:any)=>{
          console.log(data)
          this.addressData = data;
        },
        error:(error:any)=>{
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
          console.log(error)
        }
      }
    )
  }
}

