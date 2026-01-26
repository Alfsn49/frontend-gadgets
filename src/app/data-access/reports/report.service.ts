import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends HttpService{

  getDashboard(){
    return this.http.get(`${this.api}reports/dashboard-data`);
  }

  getReportsDashboard(year:any){
    return this.http.get(`${this.api}reports/dashboard-reports?year=${year}`);
  }

  getSalesSummary() {
    return this.http.get(`${this.api}reports/sales-summary`);
  }

  getSalesByMonth() {
    return this.http.get(`${this.api}reports/sales-by-month`);
  }

  getTopProducts() {
    return this.http.get(`${this.api}reports/top-products`);
  }

  getRevenueByCategory() {
    return this.http.get(`${this.api}reports/revenue-by-category`);
  }

  getOrdersByStatus() {
    return this.http.get(`${this.api}reports/orders-by-status`);
  }

  getNewClients() {
    return this.http.get(`${this.api}reports/new-clients`);
  }

  getLowStock() {
    return this.http.get(`${this.api}reports/low-stock`);
  }

}
