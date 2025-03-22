import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {
  // Definimos un arreglo para gestionar el estado de las imágenes activas
  images = [
    'https://cdn.donmai.us/sample/4d/10/__sakurai_momoka_idolmaster_and_2_more__sample-4d104d2f3f14f644efda79c9df21a580.jpg',
    'https://res.cloudinary.com/dwhexzxkv/image/upload/w_800,h_450,c_fill,f_auto,q_auto/v1/carousel/r5r4ock1onlqj6i5dnim',
    'https://res.cloudinary.com/dwhexzxkv/image/upload/w_800,h_450,c_fill,f_auto,q_auto/v1736194154/carousel/i4zoc9ilogf3a3cgtl40.jpg',
    'https://res.cloudinary.com/dwhexzxkv/image/upload/w_800,h_450,c_fill,f_auto,q_auto/v1736196590/carousel/fwkamb1eg7ld3iq6rzrm.jpg'
  ];

  // Estado para el índice activo
  currentIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    // Puede ser útil si deseas un control automático de cambio de imágenes (opcional)
    setInterval(() => {
      this.nextImage();
    }, 3000); // Cambia cada 3 segundos (ajustable)
  
  }

  // Método para cambiar a la imagen siguiente
  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  // Método para cambiar a la imagen anterior
  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  // Método para verificar si la imagen es la activa
  isActive(index: number): boolean {
    return index === this.currentIndex;
  }
}
