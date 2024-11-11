import { Component, inject } from '@angular/core';
import { UserStateService } from '../../../data-access/users/user-state.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
 userService = inject(UserStateService).loadUsers();
}
