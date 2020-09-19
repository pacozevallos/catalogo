import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CrearProductoComponent } from '../crear-producto/crear-producto.component';
import { DetalleProductoAdminComponent } from '../detalle-producto-admin/detalle-producto-admin.component';
import { EditarProductoComponent } from '../editar-producto/editar-producto.component';
import { EliminarProductoComponent } from '../eliminar-producto/eliminar-producto.component';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss']
})
export class ListaProductosComponent implements OnInit {

  count: number;
  loading: boolean;
  displayedColumns = [ 'imagen', 'nombre', 'publicado', 'detalles', 'eliminar' ];
  productsData = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.productsData.filter = filterValue;
  }


  constructor(
    private fs: FirebaseService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fs.getAllProducts().subscribe(data => {
      this.productsData.data = data;
      this.loading = false;
      this.count = data.length;
    });
    this.productsData.paginator = this.paginator;
    this.productsData.sort = this.sort;
  }

  openModalCrear() {
    const dialogRef = this.dialog.open(CrearProductoComponent, {
      panelClass: 'modalFullScreen',
    });
    dialogRef.afterClosed().subscribe();
  }


  eliminarAviso(idProduct) {
    this.fs.deleteProduct(idProduct);
  }

  openModalDetalle(producto) {
    const dialogRef = this.dialog.open(DetalleProductoAdminComponent, {
      panelClass: 'modalFullScreen',
      data: producto
    });
    dialogRef.afterClosed().subscribe();
  }

  openModalDelete(producto) {
    const dialogRef = this.dialog.open(EliminarProductoComponent, {
      data: producto
    });
    dialogRef.afterClosed().subscribe();
  }

  openModalEdit(producto) {
    const dialogRef = this.dialog.open(EditarProductoComponent, {
      panelClass: 'modalFullScreen',
      data: producto
    });
    dialogRef.afterClosed().subscribe();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.productsData.paginator = this.paginator;
    // this.avisosData.sort = this.sort;
  }

  actualizarPublicado(key, obj, e) {
    this.fs.updateAprobado(key, e);
  }

  actualizarDestacado(key, obj, e) {
    this.fs.updateDestacado(key, e);
  }

  trackByPublicado(item) {
    return item.publicado;
  }
  

}
