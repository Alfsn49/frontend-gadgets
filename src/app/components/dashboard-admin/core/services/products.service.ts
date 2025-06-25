import { Injectable } from '@angular/core';
import { HttpService } from '../../../../data-access/http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends HttpService{

  createProduct(data: any): Observable<any> {
    return this.http.post(this.api + 'product/create-product', data);
  }

  getProducts(): Observable<any> {
    return this.http.get(this.api + 'product/get-products');
  }

  updateProducts(id: number, data: any): Observable<any> {
    return this.http.patch(this.api + 'product/update-product/' + id, data);
  }

  deleteProducts(id: number): Observable<any> {
    return this.http.delete(this.api + 'product/delete-product/' + id);
  }
}
