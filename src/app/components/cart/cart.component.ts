import { Component, inject } from '@angular/core';
import { CartItemComponent } from "./ui/cart-item/cart-item.component";
import { CartStateService } from '../../data-access/cart/cart-state.service';
import { ProductItemCart } from '../../Dto/Product.dto';
import { CartService } from '../../data-access/cart/cart.service';
import { UserStateService } from '../../data-access/users/user-state.service';
import { UserService } from '../../data-access/users/user.service';
import { ToastrService } from 'ngx-toastr';
import { selectCart } from '../../core/store/cart/cart.selectors';
import { Store } from '@ngrx/store';
import { addToCart, reduceCartItem } from '../../core/store/cart/cart.actions';

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
  
  data$: any;
  
  constructor(){
    this.cartData$.subscribe(data => {
      console.log('Datos del carrito:', data.items);
      this.data$ = data;
    });
  }

  onRemoveItem(id:number){
    console.log(id)
    //this.state.remove(id);
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
    // console.log('checkout')
    // console.log(this.state.products())
    // // Recuperar el objeto JSON del localStorage
    // const userData = localStorage.getItem('User');

    // // Asegurarse de que el dato no sea nulo y parsearlo
    // const userId = userData ? JSON.parse(userData).id : null;
    // const dataCheckout = {
      
    //   userId:userId,
    //   products:this.state.products().map(product=>{
    //   return{
    //     amount: product.product.price * 100, // Multiplica por 100 si usas centavos para Stripe
    // currency: "usd",
    // productId: product.product.id,
    // name: product.product.name,
    // image: product.product.image,
    // quantity: product.quantity
    //   }
    // })}
    
    // console.log(dataCheckout)
    // this.cartService.checkout(dataCheckout).subscribe(
    //   {
    //     next:(data:any)=>{
    //       console.log(data)
    //       window.location.href = data.url;
    //     },
    //     error:(error:any)=>{
    //       console.log(error)
    //     }
    //   }
    // )
  }
}
