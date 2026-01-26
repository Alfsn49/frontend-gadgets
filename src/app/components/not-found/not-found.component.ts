import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
constructor(private router: Router) {}

  onSearch(event: any): void {
    const searchTerm = event.target.value.trim();
    if (searchTerm) {
      this.router.navigate(['/products'], { 
        queryParams: { search: searchTerm } 
      });
    }
  }
}
