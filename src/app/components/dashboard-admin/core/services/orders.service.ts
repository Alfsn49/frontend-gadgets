import { Injectable } from '@angular/core';
import { HttpService } from '../../../../data-access/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends HttpService{

  listOrders(){
    return this.http.get(this.api + 'order/findAll');
  }
}
