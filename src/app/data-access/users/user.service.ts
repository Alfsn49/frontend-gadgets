import { Injectable, inject } from '@angular/core';
import { HttpService } from '../http/http.service';
import { JwtDecodeService } from '../../services/utils/jwt-decode.service';
import { AuthService } from '../auth/auth.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpService {

  private decodeToken = inject(JwtDecodeService);
  private authService = inject(AuthService);

  profile(){
    const userdata = localStorage.getItem('User');
    const userId = userdata ? JSON.parse(userdata).id : null;
    console.log(userId)
    return this.http.get(this.api + `user/${userId}`,);
  }
}
