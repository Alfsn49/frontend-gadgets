import { Component } from '@angular/core';
import { NavbarComponent } from '../../ui/navbar/navbar.component';
import { FooterComponent } from '../../ui/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [NavbarComponent,FooterComponent,RouterOutlet],
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.css'
})
export class DashboardClientComponent {

}
