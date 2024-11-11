import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService extends HttpService{

  addorUpdateItemcart(userId:any, data:any){
    userId = localStorage.getItem('User');
    console.log(userId.id)
  }

  getCart():Observable<any>{
    const userdata = localStorage.getItem('User');
    console.log(userdata)
    const userId = userdata ? JSON.parse(userdata).id : null;
    console.log(userId)
    return this.http.get(this.api + 'cart/get-cart/'+userId)
  }

  updateCartItem(data: any): Observable<any> {
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    return this.http.post(`${this.api}cart/add-product-item/${userId}`, data);
  }

  removeProduct(productId: number): Observable<any> {
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    return this.http.delete(`${this.api}cart/remove-product/${userId}`, {
      body: { product_id: productId },
    });
  }
}
