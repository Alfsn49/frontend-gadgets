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
  userId: string | null = null;

  isLoading = signal(true)

  constructor(){
    this.getOrders()
  }

  getOrders(){
   
    this.isLoading.set(true)
    this.userService.getOrders().subscribe({
      next: (data: any) => {
        this.isLoading.set(false)
        console.log('Órdenes obtenidas:', data);
        this.orders = data;
      },
      error: (error: any) => {
        this.isLoading.set(false)
        console.error('Error al obtener órdenes:', error);
        this.toastrService.error('Error al obtener órdenes', 'Error');
      }
    });
  }

}

//Nombre del producto, imagen del producto, precio, cantidad, fecha de compra