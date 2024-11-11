import { Injectable } from '@angular/core';
import { Observable,of, tap } from 'rxjs';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService extends HttpService{

  loadProduct():Observable<any>{
     const rawProducts = localStorage.getItem('product');
     return of(rawProducts ? JSON.parse(rawProducts):[])
  }

  saveProducts(products:any):Observable<any>{

    localStorage.setItem('product', JSON.stringify(products));
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    console.log(products[0]?.product.id)
    console.log(products[0]?.quantity)
    // Retornar el Observable de la llamada HTTP
    return this.http.post(this.api + 'cart/add-product-item/'+userId,  {
      product_id: products[0]?.product.id,
      quantity:products[0]?.quantity // Opcional: Si necesitas enviar todo el arreglo de productos
    })
  }
}
