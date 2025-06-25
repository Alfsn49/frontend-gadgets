import { Injectable } from '@angular/core';
import { HttpService } from '../../../../data-access/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService extends HttpService{

  listAllClients(){
   return this.http.get(this.api + 'user/listAllUsers')
  }
}
