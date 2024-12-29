import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from '../http/http.service';
import { JwtDecodeService } from '../../services/utils/jwt-decode.service';
import { AuthService } from '../auth/auth.service';
import { HttpParams } from '@angular/common/http';
import { catchError, of, retry } from 'rxjs';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpService {
  
  private decodeToken = inject(JwtDecodeService);
  private authService = inject(AuthService);
  createAddressSignal = signal<any|null>(null)

  createDataUser(data:any){
    return this.http.post(this.api + `user/add-data`, data);

  }
  
  profile(){
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    console.log(userId)
    return this.http.get(this.api + `user/getProfile/${userId}`,);
  }

  getaddress(){

    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    return this.http.get(this.api + `user/getAddress/${userId}`);
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
}
