import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from 'src/app/classes/producto';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-detalle-producto-admin',
  templateUrl: './detalle-producto-admin.component.html',
  styleUrls: ['./detalle-producto-admin.component.scss']
})
export class DetalleProductoAdminComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DetalleProductoAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private fs: FirebaseService
  ) { }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close();
  }

}
