import { Injectable } from '@angular/core';
import { HttpService } from '../../../../data-access/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogService extends HttpService{

  getCategories(){
    return this.http.get(this.api+'product-category/get-categories')
  }

  createCategory(data:any){
    return this.http.post(this.api+'product-category/create-category',data)
  }

  editCategory(id:any,data:any){
    return this.http.patch(this.api+'product-category/update-category/'+id,data)
  }

  deleteCategory(id:any){
    return this.http.delete(this.api+'product-category/delete-category/'+id)
  }

  createSubCategory(data:any){
    return this.http.post(this.api+'product-category/create-sub-category',data)
  }

  getAllSubCategories(){
    return this.http.get(this.api+'product-category/get-sub-categories')
  }
  
  getSubCategories(id:any){
    return this.http.get(this.api+'product-category/get-sub-categories/'+id)
  }

  updateSubCategory(id:any,data:any){
    return this.http.patch(this.api+'product-category/update-sub-category/'+id,data)
  }

  deleteSubCategory(id:any){
    return this.http.delete(this.api+'product-category/delete-sub-category/'+id)
  }

  getBrands(){
    return this.http.get(this.api+'product-category/get-brands')
  }

  createBrand(data:any){
    return this.http.post(this.api+'product-category/create-brand',data)
  }

  editBrand(id:any,data:any){
    return this.http.patch(this.api+'product-category/update-brand/'+id,data)
  }

  deleteBrand(id:any){
    return this.http.delete(this.api+'product-category/delete-brand/'+id)
  }

  getSetsByBrand(id:any){
    return this.http.get(this.api+'product-category/get-sets-by-brand/'+id)}

  getSets(){
    return this.http.get(this.api+'product-category/get-sets')
  }

  createSet(data:any){
    return this.http.post(this.api+'product-category/create-set',data)
  }

  editSet(id:any,data:any){
    return this.http.patch(this.api+'product-category/update-set/'+id,data)
  }

  deleteSet(id:any){
    return this.http.delete(this.api+'product-category/delete-set/'+id)
  }

}
