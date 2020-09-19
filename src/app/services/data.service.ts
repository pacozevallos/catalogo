import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  categorias = [
    'Relojes, joyería, gafas',
    'Muebles',
    'Deportes y entrenamiento',
    'Equipaje, bolsos y estuches',
    'Vestimenta',
    'Belleza y cuidado personal',
    'Electrónica de consumo',
    'Hogar y jardín',
    'Empaquetado e impresión',
    'Regalos y artesanías',
  ]

  constructor() { }
}
