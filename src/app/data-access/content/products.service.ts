import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';


const LIMIT = 5;
@Injectable({
  providedIn: 'root'
})
export class ProductsService extends HttpService{

  getProducts(page:number){
    return this.http.get(this.api + 'product/list-products',{
      params:{
        limit: page*LIMIT
      }
    });
  }

  getProductId(id:string){
    return this.http.get(this.api + 'product/find-product',{
      params:{
        id:id
      }
    });
  }
  
}
