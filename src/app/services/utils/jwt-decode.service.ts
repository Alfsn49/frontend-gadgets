import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtDecodeService {

  constructor() { }

  public decodeToken(token:string){
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c)=>{
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload)
  }
}
