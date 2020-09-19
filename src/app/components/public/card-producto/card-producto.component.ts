import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-producto',
  templateUrl: './card-producto.component.html',
  styleUrls: ['./card-producto.component.scss']
})
export class CardProductoComponent implements OnInit {

  @Input() producto;

  constructor() { }

  ngOnInit(): void {
  }

}
