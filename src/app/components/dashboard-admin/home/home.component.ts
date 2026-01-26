import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../../data-access/reports/report.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
private report = inject(ReportService);
dataDashboard:any;
currentDate = new Date();
toast = inject(ToastrService)

constructor(){

  this.getData();

}

getData(){
    this.report.getDashboard().subscribe({
      next:(data:any)=>{
        console.log(data)
        this.dataDashboard = data;
      },
      error:(error:any)=>{
        console.log(error)
      }
    })
  }
   refreshData() {
    this.getData();
    // Simular efecto de carga
    setTimeout(() => {
      // Aquí podrías añadir una notificación de éxito
      this.toast.success("Datos actualizado correctamente")
    }, 500);
  }

  exportReport() {
    // Lógica para exportar reporte
    console.log('Exportando reporte...');
    // Implementar exportación a PDF/Excel
  }
}
