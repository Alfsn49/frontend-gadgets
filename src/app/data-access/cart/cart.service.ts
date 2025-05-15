import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService extends HttpService{

  addorUpdateItemcart(userId:any, data:any){
    userId = localStorage.getItem('User');
    console.log(userId.id)
  }

 // Guarda el carrito en localStorage
 saveCartToLocalStorage(cartData: any): void {
  localStorage.setItem('cart', JSON.stringify(cartData));
}

clearCartFromLocalStorage(){
  localStorage.removeItem('cart');
}

// Carga el carrito desde localStorage
loadCartFromLocalStorage(): any {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : {
    id: null,
    user_id: null,
    total: 0,
    completed: false,
    items: []
  };
}

// Método auxiliar para el getCart (mejor tipado)
getCart(): Observable<{cart: any, products: any[]}> {
  return this.http.get<{cart: any, products: any[]}>(`${this.api}cart/get-cart`).pipe(
    tap(response => console.log('Respuesta del backend:', response))
  );
}

  updateCartItem(data: any): Observable<any> {
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    console.log(data)
    return this.http.post(`${this.api}cart/add-product-item/${userId}`, data);
  }

  removeProduct(productId: number): Observable<any> {
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    console.log(productId)
    return this.http.delete(`${this.api}cart/remove-product/${userId}`, {
      body: { product_id: productId },
    });
  }

  checkout(data: any): Observable<any> {
    return this.http.post(`${this.api}stripe/checkout`, data);
  }
}
