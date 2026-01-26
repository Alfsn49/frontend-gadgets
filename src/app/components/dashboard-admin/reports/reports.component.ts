// reports.component.ts
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ReportService } from '../../../data-access/reports/report.service';
import { CommonModule, DatePipe, CurrencyPipe, TitleCasePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, TitleCasePipe, SlicePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  reportService = inject(ReportService);

  // Variables con signals para reactividad
  salesSummary = signal<any>(null);
  salesByMonth = signal<any[]>([]);
  selectedYear = signal<number>(new Date().getFullYear());
  topProducts = signal<any[]>([]);
  revenueByCategory = signal<any[]>([]);
  ordersByStatus = signal<any[]>([]);
  newClients = signal<any>(null);
  lowStock = signal<any[]>([]);
  
  // Variables adicionales
  lastUpdate = new Date();
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  years = signal<number[]>([]); // Lista de años disponibles

  // Computed property para maxSales (necesario para tu HTML)
  maxSales = computed(() => {
    const data = this.salesByMonth();
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map(item => item.total || 0));
  });

  ngOnInit() {
    this.loadDashboardData();
  }

  // MÉTODO UNIFICADO - SOLO UNA LLAMADA
  loadDashboardData(year?: number) {
    this.isLoading.set(true);
    this.error.set(null);
    
    // Si se pasa un año, actualiza el año seleccionado
    if (year) {
      this.selectedYear.set(year);
    }
    
    this.reportService.getReportsDashboard(this.selectedYear()).subscribe({
      next: (data: any) => {
        console.log('Datos unificados recibidos:', data);
        
        // Asigna todos los datos desde la respuesta unificada
        this.salesSummary.set(data.salesSummary || {});
        this.salesByMonth.set(data.salesByMonth || []);
        this.topProducts.set(data.topProducts || []);
        this.revenueByCategory.set(data.revenueByCategory || []);
        this.ordersByStatus.set(data.ordersByStatus || []);
        this.newClients.set(data.newClients || {});
        this.lowStock.set(data.lowStockProducts || []);
        
        // Actualiza el año seleccionado si viene en los datos
        if (data.metadata?.year) {
          this.selectedYear.set(data.metadata.year);
        }
        
        this.lastUpdate = new Date();
        this.isLoading.set(false);
        
        // Genera lista de años disponibles
        this.generateAvailableYears();
        
        // DEBUG: Verificar la lógica
        this.logDebugInfo();
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.error.set('Error al cargar los datos del dashboard');
        this.isLoading.set(false);
      }
    });
  }

  // Método para generar años disponibles (últimos 5 años + próximos 2)
  generateAvailableYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Últimos 5 años
    for (let i = 5; i >= 1; i--) {
      years.push(currentYear - i);
    }
    
    // Año actual
    years.push(currentYear);
    
    // Próximos 2 años
    for (let i = 1; i <= 2; i++) {
      years.push(currentYear + i);
    }
    
    this.years.set(years);
  }

  // Método para cambiar de año
  onYearSelectChange(year: string) {
    const yearNum = parseInt(year);
    if (!isNaN(yearNum)) {
      this.selectedYear.set(yearNum);
      this.loadDashboardData(); // Recarga los datos con el nuevo año
    }
  }

  // Método para refrescar los datos manualmente
  refreshData() {
    console.log('Refrescando datos manualmente...');
    this.loadDashboardData();
  }

  // Método para formatear el tiempo desde la última actualización
  getTimeSinceLastUpdate(): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - this.lastUpdate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `Hace ${diffInSeconds} segundos`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
  }

  // Resto de los métodos se mantienen igual...
  getTotalAnnualSales(): number {
    const data = this.salesByMonth();
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, month) => sum + (month.total || 0), 0);
  }

  getTotalOrders(): number {
    const data = this.ordersByStatus();
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, order) => sum + (order.total || 0), 0);
  }

  getPercentage(order: any): number {
    const total = this.getTotalOrders();
    const orderTotal = order?.total || 0;
    return total > 0 ? Math.round((orderTotal / total) * 100) : 0;
  }

  getProductPercentage(product: any): number {
    const products = this.topProducts();
    if (!products || products.length === 0) return 0;
    
    const totalRevenue = products.reduce((sum, p) => {
      const productRevenue = (p.total_sold || 0) * (p.price || 1);
      return sum + productRevenue;
    }, 0);
    
    const productRevenue = (product.total_sold || 0) * (product.price || 1);
    return totalRevenue > 0 ? Math.round((productRevenue / totalRevenue) * 100) : 0;
  }

  getCategoryPercentage(category: any): number {
    const categories = this.revenueByCategory();
    if (!categories || categories.length === 0) return 0;
    
    const total = categories.reduce((sum, c) => sum + (c.total || 0), 0);
    const categoryTotal = category?.total || 0;
    return total > 0 ? Math.round((categoryTotal / total) * 100) : 0;
  }

  getStatusColor(status: string): string {
    if (!status) return '#6B7280';
    
    const colors: { [key: string]: string } = {
      'procesando': '#3B82F6', // blue-500
      'enviado': '#10B981',    // emerald-500
      'entregado': '#8B5CF6',  // violet-500
      'cancelado': '#EF4444',  // red-500
      'pendiente': '#F59E0B',   // amber-500
      'pending': '#F59E0B',     // en inglés
      'processing': '#3B82F6',
      'shipped': '#10B981',
      'delivered': '#8B5CF6',
      'cancelled': '#EF4444'
    };
    return colors[status.toLowerCase()] || '#6B7280'; // gray-500 por defecto
  }

  getDashArray(order: any, index: number): string {
    const percentage = this.getPercentage(order);
    const circumference = 2 * Math.PI * 40;
    const dashLength = (percentage / 100) * circumference;
    return `${dashLength} ${circumference}`;
  }

  getDashOffset(index: number): number {
    if (index === 0) return 0;
    
    let offset = 0;
    const orders = this.ordersByStatus();
    
    for (let i = 0; i < index && i < orders.length; i++) {
      const order = orders[i];
      if (order) {
        const percentage = this.getPercentage(order);
        const circumference = 2 * Math.PI * 40;
        offset += (percentage / 100) * circumference;
      }
    }
    return -offset;
  }

  getDebugInfo(): any {
    return {
      salesByMonth: this.salesByMonth(),
      maxSales: this.maxSales(),
      hasNoSalesData: this.hasNoSalesData(),
      getBarHeightForJan: this.getBarHeight(644),
      getBarHeightForFeb: this.getBarHeight(0)
    };
  }

  logDebugInfo() {
    console.log('DEBUG:', this.getDebugInfo());
    
    this.salesByMonth().forEach((item, index) => {
      console.log(`Mes ${item.monthShort}: total=${item.total}, height=${this.getBarHeight(item.total)}`);
    });
  }

  hasNoSalesData(): boolean {
    const data = this.salesByMonth();
    if (!data || data.length === 0) return true;
    
    return data.every(item => !item.total || item.total === 0);
  }

  getCurrentYearFromData(): number {
    return this.selectedYear();
  }

  getBarHeight(total: number): string {
    const max = this.maxSales();
    if (max === 0) return '10%';
    
    const minHeight = 10;
    const calculatedHeight = (total / max) * 100;
    
    if (total === 0) {
      return `${minHeight}%`;
    }
    
    return `${Math.max(minHeight, calculatedHeight)}%`;
  }

  getMonthFullName(monthString: string): string {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    try {
      const monthNumber = parseInt(monthString.split('-')[1]) - 1;
      return monthNames[monthNumber] || monthString;
    } catch {
      return monthString;
    }
  }

  formatSalesValue(value: number): string {
    if (value === 0) return '$0';
    if (value < 1000) return `$${value}`;
    if (value < 1000000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${(value / 1000000).toFixed(1)}M`;
  }

  isCurrentMonth(monthString: string): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    try {
      const [year, month] = monthString.split('-').map(Number);
      return year === currentYear && month === currentMonth;
    } catch {
      return false;
    }
  }

  getMonthlyAverage(): number {
    const total = this.getTotalAnnualSales();
    const monthsWithSales = this.salesByMonth().filter(m => m.total > 0).length;
    
    return monthsWithSales > 0 ? total / monthsWithSales : 0;
  }

  getBestMonth(): any {
    const data = this.salesByMonth();
    if (!data || data.length === 0) return null;
    
    const monthsWithSales = data.filter(item => item.total > 0);
    if (monthsWithSales.length === 0) return null;
    
    const bestMonth = monthsWithSales.reduce((prev, current) => 
      (prev.total > current.total) ? prev : current
    );
    
    return bestMonth;
  }

  getBarTooltip(item: any): string {
    if (!item || item.total === undefined || item.total === null) {
      return '$0.00';
    }
    
    return `$${item.total.toFixed(2)}`;
  }

  showTooltip = false;
  currentTooltipIndex = -1;
  currentHoveredItem: any = null;

  getBarHeightInPixels(total: number): number {
    const max = this.maxSales();
    const maxPixels = 180;
    
    if (max === 0) return 20;
    
    if (total === 0) return 15;
    
    const calculatedHeight = (total / max) * maxPixels;
    return Math.max(30, calculatedHeight);
  }

  getBarHeightPercentage(total: number): string {
    const max = this.maxSales();
    
    if (max === 0) return '10%';
    
    if (total === 0) return '8%';
    
    const calculatedHeight = (total / max) * 80;
    return `${Math.max(25, calculatedHeight)}%`;
  }

  onBarHover(item: any, index: number) {
    this.currentHoveredItem = item;
    this.currentTooltipIndex = index;
    this.showTooltip = true;
  }

  onBarLeave() {
    this.showTooltip = false;
    this.currentTooltipIndex = -1;
    this.currentHoveredItem = null;
  }

  getBarColor(total: number): string {
    if (total === 0) return 'from-gray-200 to-gray-100';
    if (total < 1000) return 'from-blue-400 to-blue-300';
    if (total < 5000) return 'from-blue-500 to-blue-400';
    return 'from-blue-600 to-blue-500';
  }
}