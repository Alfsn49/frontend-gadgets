import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = true;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() toggleNotificationSidebarEvent = new EventEmitter<void>();
  @Output() logoutEvent = new EventEmitter<void>();
  @Output() goToSettingsEvent = new EventEmitter<void>();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private store: Store
  ) {}

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  toggleNotificationSidebar() {
    this.toggleNotificationSidebarEvent.emit();
  }

  goToSettings() {
    this.goToSettingsEvent.emit();
  }

  logout() {
    this.logoutEvent.emit();
  }
}
