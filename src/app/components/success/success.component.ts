// success.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadCart, cartCompleted, refreshCart } from '../../core/store/cart/cart.actions';
import { CartService } from '../../data-access/cart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit, OnDestroy {
  loading = true;
  paymentStatus: string | null = null;
  cartService = inject(CartService);
  store = inject(Store);
  sessionId: string | null = null;
  countdown = 5;
  private countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    // Limpiar carrito y forzar recarga
    this.cartService.clearCartFromLocalStorage();
    this.store.dispatch(cartCompleted());
    this.store.dispatch(refreshCart());
  }

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!this.sessionId) {
      this.router.navigate(['/']);
      return;
    }

    // Iniciar contador
    this.startCountdown();


  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
        this.goToHome();
      }
    }, 1000);
  }



  handleFailedPayment() {
    // Cambiar contador a 10 segundos para dar tiempo al usuario
    clearInterval(this.countdownInterval);
    this.countdown = 10;
    this.startCountdown();
  }

  getStatusText(): string {
    switch (this.paymentStatus) {
      case 'paid':
      case 'complete':
        return 'Pago Confirmado ✓';
      case 'processing':
        return 'Procesando Pago ⏳';
      case 'error':
        return 'Error en el Pago ⚠️';
      default:
        return this.loading ? 'Verificando...' : 'Estado Desconocido';
    }
  }

  getStatusMessage(): string {
    switch (this.paymentStatus) {
      case 'paid':
      case 'complete':
        return '¡Felicidades! Tu pedido ha sido procesado exitosamente. Te hemos enviado un correo con los detalles.';
      case 'processing':
        return 'Tu pago está siendo procesado. Esto puede tomar unos minutos. Te notificaremos cuando esté completo.';
      case 'error':
        return 'Hubo un problema procesando tu pago. Por favor, intenta nuevamente o contacta con soporte.';
      default:
        return 'Estamos verificando el estado de tu transacción...';
    }
  }

  goToHome() {
    this.router.navigate(['/']).then(() => {
      // Forzar recarga del carrito
      this.store.dispatch(loadCart());
    });
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  continueCountdown() {
    this.startCountdown();
  }
}