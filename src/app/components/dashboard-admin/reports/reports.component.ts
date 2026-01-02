import { Component, inject } from '@angular/core';
import { ReportService } from '../../../data-access/reports/report.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  reportService = inject(ReportService);

  // Variables para guardar los datos de cada reporte
  salesSummary: any = null;
  salesByMonth: any[] = [];
  topProducts: any[] = [];
  revenueByCategory: any[] = [];
  ordersByStatus: any[] = [];
  newClients: any = null;
  lowStock: any[] = [];

  constructor() {
    this.loadReports();
  }

  loadReports() {
    this.getSalesSummary();
    this.getSalesByMonth();
    this.getTopProducts();
    this.getRevenueByCategory();
    this.getOrdersByStatus();
    this.getNewClients();
    this.getLowStock();
  }

  getSalesSummary() {
    this.reportService.getSalesSummary().subscribe({
      next: (data: any) => (this.salesSummary = data),
      error: (err: any) => console.error(err),
    });
  }

  getSalesByMonth() {
    this.reportService.getSalesByMonth().subscribe({
      next: (data: any) => (this.salesByMonth = data),
      error: (err: any) => console.error(err),
    });
  }

  getTopProducts() {
    this.reportService.getTopProducts().subscribe({
      next: (data: any) => (this.topProducts = data),
      error: (err: any) => console.error(err),
    });
  }

  getRevenueByCategory() {
    this.reportService.getRevenueByCategory().subscribe({
      next: (data: any) => {
        console.log(data)
        this.revenueByCategory = data},
      error: (err: any) => console.error(err),
    });
  }

  getOrdersByStatus() {
    this.reportService.getOrdersByStatus().subscribe({
      next: (data: any) => {
        console.log(data)
        this.ordersByStatus = data},
      error: (err: any) => console.error(err),
    });
  }

  getNewClients() {
    this.reportService.getNewClients().subscribe({
      next: (data: any) => (this.newClients = data),
      error: (err: any) => console.error(err),
    });
  }

  getLowStock() {
    this.reportService.getLowStock().subscribe({
      next: (data: any) => (this.lowStock = data),
      error: (err: any) => console.error(err),
    });
  }
}
