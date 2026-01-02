import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../../data-access/reports/report.service';
import { CommonModule } from '@angular/common';

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

}
