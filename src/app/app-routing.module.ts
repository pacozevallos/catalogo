import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CrearProductoComponent } from './components/crear-producto/crear-producto.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PublicComponent } from './components/public/public.component';

const routes: Routes = [
  {
    path: '', component: PublicComponent,
    children: [
      { path: '', component: InicioComponent },
    ]
  },
  {
    path: 'admin', component: AdminComponent,
    children: [
      { path: 'crearProducto', component: CrearProductoComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
