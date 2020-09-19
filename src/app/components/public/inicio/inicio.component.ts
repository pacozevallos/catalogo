import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  productos;

  constructor(
    private fs: FirebaseService
  ) { }

  ngOnInit(): void {
    this.productos = this.fs.getProducts();
  }

}
