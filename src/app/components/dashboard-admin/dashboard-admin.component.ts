import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { logoutAdmin } from '../../core/store/auth/auth.actions';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterOutlet],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {
  isSidebarOpen: boolean = true;
  isNotificationSidebarOpen: boolean = false;
  loading: boolean = false;

  isAssignDropdownOpen = false;
  isUserDropdownOpen = false;

  private toastr = inject(ToastrService);
  private router = inject(Router);
  private store = inject(Store)
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    localStorage.setItem('sidebarState', JSON.stringify(this.isSidebarOpen));
  }
  toggleNotificationSidebar(): void {
    this.isNotificationSidebarOpen = !this.isNotificationSidebarOpen;
  }

  toggleAssignDropdown() {
    this.isAssignDropdownOpen = !this.isAssignDropdownOpen;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }
  goToSettings() {
    this.loading = true;
    setTimeout(() => {
      this.router.navigate(["/admin/dashboard/config"]);
      this.loading = false;
    }, 2000);
  }

  logout(){
    this.store.dispatch(logoutAdmin());
  }

  notifications = [
    { message: "Nueva actualización disponible" },
    { message: "Tienes un mensaje pendiente" },
    { message: "Revisión de documentos completada" }
  ];
}
