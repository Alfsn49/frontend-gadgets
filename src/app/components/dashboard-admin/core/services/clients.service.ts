import { Injectable } from '@angular/core';
import { HttpService } from '../../../../data-access/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService extends HttpService{

  listAllClients(){
   return this.http.get(this.api + 'user/listAllUsers')
  }

  updateClients(data:any,userId:any){
    return this.http.put(this.api + `user/updateClienteAdmin/${userId}`,data)
  }

  deleteClients(userId:any){
    return this.http.delete(this.api + `user/delete-user/${userId}`)
  }
}
