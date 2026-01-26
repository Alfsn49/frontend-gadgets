import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {
  images = [
    'https://res.cloudinary.com/dwhexzxkv/image/upload/w_1920,h_600,c_fill,f_auto,q_auto/v1/carousel/r5r4ock1onlqj6i5dnim',
    'https://res.cloudinary.com/dwhexzxkv/image/upload/w_1920,h_600,c_fill,f_auto,q_auto/v1736194154/carousel/i4zoc9ilogf3a3cgtl40.jpg',
    'https://res.cloudinary.com/dwhexzxkv/image/upload/w_1920,h_600,c_fill,f_auto,q_auto/v1736196590/carousel/fwkamb1eg7ld3iq6rzrm.jpg'
  ];

  currentIndex: number = 0;
  private intervalId: any;

  ngOnInit() {
    // Auto-play cada 5 segundos
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToImage(index: number) {
    this.currentIndex = index;
    // Reiniciar auto-play al hacer clic manual
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  isActive(index: number): boolean {
    return index === this.currentIndex;
  }
}
