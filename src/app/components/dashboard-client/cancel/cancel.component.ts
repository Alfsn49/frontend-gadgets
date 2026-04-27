import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.css'
})
export class CancelComponent implements OnInit, OnDestroy{

countdown: number = 5;
  progress: number = 100;
  circumference: number = 2 * Math.PI * 32; // 2 * pi * radio (32)
  randomCardNumber: string;
  private intervalId: any;

  constructor(private router: Router) {
    // Generar número de carta aleatorio
    this.randomCardNumber = `TCG-${Math.floor(Math.random() * 10000)}/${new Date().getFullYear()}`;
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCountdown(): void {
    this.intervalId = setInterval(() => {
      if (this.countdown > 1) {
        this.countdown--;
        this.progress = (this.countdown / 5) * 100;
      } else {
        this.redirectToHome();
      }
    }, 1000);
  }

  redirectNow(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.redirectToHome();
  }

  goBack(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    window.history.back();
  }

  private redirectToHome(): void {
    this.router.navigate(['/']);
  }
}
