import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../data-access/users/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  userService = inject(UserService);
  toastrService = inject(ToastrService);

  orders: any[] = []
  isLoading = signal(true)

  // Definir tipos para los estados
  private estadosMap: { [key: string]: string } = {
    'procesando': 'Procesando',
    'enviado': 'Enviado',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado',
    'pagada': 'Pagado',
    'pendiente': 'Pendiente',
    'cancelada': 'Cancelado'
  };

  private estadosPagoMap: { [key: string]: string } = {
    'paid': 'Pagado',
    'pending': 'Pendiente',
    'enviado': 'Enviado',
    'failed': 'Fallido',
    'refunded': 'Reembolsado',
    'canceled': 'Cancelado'
  };

  constructor() {
    this.getOrders()
  }

  getOrders() {
    this.isLoading.set(true)
    this.userService.getOrders().subscribe({
      next: (data: any) => {
        this.isLoading.set(false)
        console.log('Órdenes obtenidas:', data);
        // Ordenar por fecha (más recientes primero)
        this.orders = data.sort((a: any, b: any) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
      },
      error: (error: any) => {
        this.isLoading.set(false)
        console.error('Error al obtener órdenes:', error);
        this.toastrService.error('Error al obtener órdenes', 'Error');
      }
    });
  }

  // Método para obtener texto del estado
  getEstadoTexto(estado: string): string {
    if (!estado) return 'Desconocido';
    const estadoLower = estado.toLowerCase();
    return this.estadosMap[estadoLower] || estado;
  }

  // Método para obtener clase CSS según el estado
  getEstadoClase(estado: string): string {
    if (!estado) return 'bg-gradient-to-r from-gray-500 to-gray-600';
    
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
      case 'procesando':
        return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'enviado':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'entregado':
        return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'cancelado':
      case 'cancelada':
        return 'bg-gradient-to-r from-red-500 to-rose-600';
      case 'pagada':
        return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'pendiente':
        return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  }

  // Método para obtener color de punto según el estado
  getEstadoPuntoClase(estado: string): string {
    if (!estado) return 'bg-gray-500';
    
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
      case 'procesando':
        return 'bg-yellow-500';
      case 'enviado':
        return 'bg-blue-500';
      case 'entregado':
        return 'bg-green-500';
      case 'cancelado':
      case 'cancelada':
        return 'bg-red-500';
      case 'pagada':
        return 'bg-green-500';
      case 'pendiente':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }

  // Método para obtener texto del estado de pago
  getPaymentStatusTexto(paymentStatus: string): string {
    if (!paymentStatus) return 'Desconocido';
    const statusLower = paymentStatus.toLowerCase();
    return this.estadosPagoMap[statusLower] || paymentStatus;
  }

  // Ahora usa order.total que viene del backend
  calcularTotalPedido(order: any): number {
    return order.total || 0; // Usa el total que viene del backend
  }

  calcularTotalGastado(): number {
    if (!this.orders) return 0;
    return this.orders.reduce((total: number, order: any) => {
      return total + (order.total || 0); // Usa el total que viene del backend
    }, 0);
  }

  getUltimaFecha(): Date {
    if (!this.orders || this.orders.length === 0) return new Date();
    const fechas = this.orders.map(order => new Date(order.fecha));
    return new Date(Math.max(...fechas.map(date => date.getTime())));
  }

  getTotalProductos(): number {
    if (!this.orders) return 0;
    return this.orders.reduce((total: number, order: any) => {
      return total + (order.cantidadProductos || order.productos?.reduce((sum: number, producto: any) => 
        sum + (producto.cantidad || 0), 0) || 0);
    }, 0);
  }

  // Nuevos métodos de estadísticas
  getPedidosEnviados(): number {
    if (!this.orders) return 0;
    return this.orders.filter(order => {
      const estado = order.estado?.toLowerCase();
      return estado === 'enviado' || estado === 'entregado';
    }).length;
  }

  getPedidosProcesando(): number {
    if (!this.orders) return 0;
    return this.orders.filter(order => {
      const estado = order.estado?.toLowerCase();
      return estado === 'procesando' || estado === 'pendiente';
    }).length;
  }

  getPedidosPagados(): number {
    if (!this.orders) return 0;
    return this.orders.filter(order => {
      const paymentStatus = order.paymentStatus?.toLowerCase();
      return paymentStatus === 'paid';
    }).length;
  }

  getPromedioPedido(): number {
    if (!this.orders || this.orders.length === 0) return 0;
    return this.calcularTotalGastado() / this.orders.length;
  }

  getPedidosPorEstado(): { [key: string]: number } {
    if (!this.orders) return {};
    return this.orders.reduce((acc: { [key: string]: number }, order) => {
      const estado = order.estado?.toLowerCase() || 'desconocido';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});
  }

  // Método para obtener tiempo transcurrido desde la fecha
  getTiempoTranscurrido(fecha: string): string {
    if (!fecha) return '';
    
    const ahora = new Date();
    const fechaPedido = new Date(fecha);
    const diferenciaMs = ahora.getTime() - fechaPedido.getTime();
    const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias === 0) return 'Hoy';
    if (diferenciaDias === 1) return 'Ayer';
    if (diferenciaDias < 7) return `Hace ${diferenciaDias} días`;
    if (diferenciaDias < 30) return `Hace ${Math.floor(diferenciaDias / 7)} semanas`;
    if (diferenciaDias < 365) return `Hace ${Math.floor(diferenciaDias / 30)} meses`;
    return `Hace ${Math.floor(diferenciaDias / 365)} años`;
  }

  // Método para formatear la fecha
  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para obtener la hora
  getHora(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para obtener el día de la semana
  getDiaSemana(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[date.getDay()];
  }
}