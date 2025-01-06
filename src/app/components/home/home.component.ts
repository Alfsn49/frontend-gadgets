import { Component, inject } from '@angular/core';
import { AuthService } from '../../data-access/auth/auth.service';
import { UserService } from '../../data-access/users/user.service';
import { ProductsStateService } from '../../data-access/content/products-state.service';
import { CarouselComponent } from '../../ui/carousel/carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {



}
