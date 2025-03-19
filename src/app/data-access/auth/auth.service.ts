import { inject, Injectable,signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HttpService } from '../http/http.service';
import { catchError, Observable, throwError, tap, map } from 'rxjs';
import { Rol } from '../../Dto/rol.dto';
import { LoginDto, RegisterDto } from '../../Dto/Auth.dto';
import { JwtDecodeService } from '../../services/utils/jwt-decode.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpService{
  private decodeToken = inject(JwtDecodeService);
   isRefreshingToken = false;
  private readonly tokenKey = 'token';

   loggedInSignal = signal<boolean>(!!localStorage.getItem(this.tokenKey));

  get isLoggedIn() {
    return this.loggedInSignal();
  }

  login(data:LoginDto){
   
    return this.http.post(this.api + 'auth/login', data)
    
  }

  signup(data:any){
    return this.http.post(this.api + 'auth/register', data);
  }

  tokenResetPassword(token:string){
    return this.http.get(this.api + 'user/validate-reset?token='+token);
  }

  resertPassword(data:any, token:any){
    return this.http.post(this.api + 'user/reset-password/'+token, data);
  }

  requestResetPassword(email:string){
    console.log(email)
    return this.http.post(this.api + 'user/request-password-reset', email);
  }
  getToken(){
    return localStorage.getItem('token') || '';
  }

  uploadImage(file:File){
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(this.api +'cloudinary/upload', formData);
  }

  profile(){
    const token = this.getToken();  
    const data= this.decodeToken.decodeToken(token);
    const id = data.id; 
    console.log('Id', id  );
    console.log('Profile', data);
    return data;

  }

  getRoles():Observable<Rol>{
    return this.http.get<any>(this.api + 'rol/getRolCliente');
  }

  refrershToken(){
    const refreshToken = localStorage.getItem('refreshToken') || '';
    console.log('Refresh Token', refreshToken);
    const headers = {
      Authorization: `Refresh ${refreshToken}`
    };
    this.isRefreshingToken = true;
    return this.http.post(this.api + 'auth/refresh','', { headers })}
  logout(){
    this.loggedInSignal.set(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('User');
  }
  }
