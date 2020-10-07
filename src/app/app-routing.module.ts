import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { ListaProductosComponent } from './components/admin/productos/lista-productos/lista-productos.component';
import { InicioComponent } from './components/public/inicio/inicio.component';
import { PublicComponent } from './components/public/public.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { LoginComponent } from './components/public/login/login.component';
// import { AuthGuard } from './guards/auth.guard';

// Angularfire
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: '', component: PublicComponent,
    children: [
      { path: '', component: InicioComponent },
      { path: 'login', component: LoginComponent },
    ]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [
      AngularFireAuthGuard],
      data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      { path: 'productos', component: ListaProductosComponent },
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
