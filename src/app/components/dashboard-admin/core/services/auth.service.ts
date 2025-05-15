import { Injectable } from '@angular/core';
import { HttpService } from '../../../../data-access/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpService{



  getRols(){
   return this.http.get(this.api+'rol/getRols')
  }

  createRol(data:any){
    return this.http.post(this.api+'rol/createRol',data)
  }

  updateRol(id:any,data:any){
    return this.http.patch(this.api+'rol/updateRol/'+id,data)
  }

  deleteRol(id:any){
    return this.http.delete(this.api+'rol/deleteRol/'+id)
  }
}
