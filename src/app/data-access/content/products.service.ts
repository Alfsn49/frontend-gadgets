import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';


const LIMIT = 5;
@Injectable({
  providedIn: 'root'
})
export class ProductsService extends HttpService{

  // products.service.ts
getProducts(page: number, limit: number, filters: any = {}): Observable<any> {
  const params: any = {
    page,
    limit,
  };

  if (filters.category) {
    params.categoryId = filters.category;
  }

  if (filters.minPrice !== null) {
    params.minPrice = filters.minPrice;
  }

  if (filters.maxPrice !== null) {
    params.maxPrice = filters.maxPrice;
  }

  if (filters.sort) {
    params.sort = filters.sort;
  }

  return this.http.get(this.api +'product/list-products', { params });
}



  getProductId(id:string){
    return this.http.get(this.api + 'product/find-product',{
      params:{
        id:id
      }
    });
  }
  
  getFilteredProducts(filters:any){
    return this.http.get(this.api + 'product/find-product-by-category',{
      params:filters
    });
  }

  getCategories(): Observable<any>{
    return this.http.get(this.api + 'product-category/get-categories');
  }

  getSubCategories(id:number): Observable<any>{
    console.log(id)
    const data = this.http.get(this.api + 'product-category/get-sub-categories/' + id);
    console.log(data)
    return data;
  }

  getBrands(): Observable<any>{
    return this.http.get(this.api + 'product-category/get-brands');
  }

  searchProducts(search:string |any){
    return this.http.get(this.api + `product/search?q=${search}`); 
  }
}
