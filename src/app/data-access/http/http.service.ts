import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class  HttpService {
  http = inject(HttpClient);
  api= import.meta.env.NG_APP_BACKEND_URL;
  
}
