import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadCart } from '../../core/store/cart/cart.actions';
import { CartService } from '../../data-access/cart/cart.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
loading = true;
paymentStatus: string | null = null;
cartService = inject(CartService);
store = inject(Store);

constructor(private route: ActivatedRoute,
  private router: Router,
  private http: HttpClient){
  this.cartService.clearCartFromLocalStorage();
  this.store.dispatch(loadCart());
  setTimeout(() => {
      // Redirige y fuerza recarga
      window.location.href = '/';
    }, 5000);
}

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  
  
  const  sessionId= this.route.snapshot.queryParamMap.get('session_id');

  if(!sessionId){
    this.router.navigate(['/']);
    return;
  }

  this.http.get<any>(`http://localhost:3000/stripe/payment/status?session_id=${sessionId}`)
  .subscribe({
    next: (response) => {
      console.log(response);
      this.paymentStatus = response.payment_status === 'complete' ? 'complete' : 'error';
      this.loading = true;
    },
    error: (  ) => {
      console.log('error');
      this.paymentStatus = 'error';
      this.loading = false;
    },
  });
}
}
