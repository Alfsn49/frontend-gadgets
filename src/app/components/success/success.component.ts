import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
loading = true;
paymentStatus: string | null = null;

constructor(private route: ActivatedRoute,
  private router: Router,
  private http: HttpClient){

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
      this.paymentStatus = response.payment_status === 'paid' ? 'paid' : 'error';
      this.loading = false;
    },
    error: (  ) => {
      console.log('error');
      this.paymentStatus = 'error';
      this.loading = false;
    },
  });
}
}
