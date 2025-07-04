import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from '../http/http.service';
import { JwtDecodeService } from '../../services/utils/jwt-decode.service';
import { AuthService } from '../auth/auth.service';
import { HttpParams } from '@angular/common/http';
import { catchError, Observable, of, retry } from 'rxjs';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpService {
  
  
  createAddressSignal = signal<any|null>(null)

  createDataUser(data:any){
    return this.http.post(this.api + `user/add-data`, data);

  }
  
  profile():Observable<any>{
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    console.log(userId)
    return this.http.get(this.api + `user/getProfile/${userId}`,);
  }

  editProfile(data:any){
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    return this.http.patch(this.api + `user/editUser/${userId}`, data);
  }

  getaddress(){

    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    return this.http.get(this.api + `user/getAddress/${userId}`);
  }

  verifydataUser(){
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    return this.http.get(this.api + `user/verify-dataUser/${userId}`).pipe(
      retry(3),
      catchError((error)=>{
        console.error('Error en la verificación',error)
        return of(null);
      })
    );
  }

  createAddress(data:any){
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    console.log('creación de dirección apuntando')
    return this.http.post<any>(this.api + `user/createAddress/${userId}`, data).pipe(
      retry(3),
      catchError((error)=>{
        console.error('Error en la creación',error)
        return of(null);
      })
    
    )
    
    //return this.http.post(this.api + `user/createAddress/${userId}`, data);
  }

  editAddress(data:any){
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    return this.http.patch(this.api + `user/editAddress/${userId}`, data);
  }

  preferedAddress(data:any){
    return this.http.get(this.api + `user/preferedAddress/`+ data);
  }

  deleteAddress(id:string){
    return this.http.delete(this.api + `user/deleteAddress/${id}`);
  }

  getOrders(){
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    return this.http.get(this.api + `order/ordersbyUser/${userId}`);
  }
}
