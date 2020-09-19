import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from 'src/app/classes/producto';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-eliminar-producto',
  templateUrl: './eliminar-producto.component.html',
  styleUrls: ['./eliminar-producto.component.scss']
})
export class EliminarProductoComponent implements OnInit {

  deshabilitado: boolean;

  constructor(
    private fs: FirebaseService,
    private dialogRef: MatDialogRef<EliminarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  eliminarProducto(idProduct, imageName) {
    this.deshabilitado = true;

    this.fs.deleteProduct(idProduct)
    .then(() => {
      this.dialogRef.close();
      this.snackBar.open('Producto eliminado', 'CERRAR', {
        duration: 3000,
      });
    });

    this.fs.deleteProductStorage(idProduct, imageName);
  }

  cancelar() {
    this.dialogRef.close();
  }

}
