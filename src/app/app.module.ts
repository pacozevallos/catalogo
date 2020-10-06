import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angularfire2
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule  } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MaterialFileInputModule } from 'ngx-material-file-input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AdminComponent } from './components/admin/admin.component';
import { PublicComponent } from './components/public/public.component';
import { CrearProductoComponent } from './components/admin/productos/crear-producto/crear-producto.component';
import { EliminarProductoComponent } from './components/admin/productos/eliminar-producto/eliminar-producto.component';
import { EditarProductoComponent } from './components/admin/productos/editar-producto/editar-producto.component';
import { ListaProductosComponent } from './components/admin/productos/lista-productos/lista-productos.component';
import { HeaderComponent } from './components/public/header/header.component';
import { InicioComponent } from './components/public/inicio/inicio.component';
import { FooterComponent } from './components/public/footer/footer.component';
import { DetalleProductoAdminComponent } from './components/admin/productos/detalle-producto-admin/detalle-producto-admin.component';
import { CardProductoComponent } from './components/public/card-producto/card-producto.component';
import { LoginComponent } from './components/public/login/login.component';
import { HeaderAdminComponent } from './components/admin/header-admin/header-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    PublicComponent,
    InicioComponent,
    AdminComponent,
    CrearProductoComponent,
    EliminarProductoComponent,
    EditarProductoComponent,
    ListaProductosComponent,
    HeaderComponent,
    FooterComponent,
    DetalleProductoAdminComponent,
    CardProductoComponent,
    LoginComponent,
    HeaderAdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MaterialModule,
    MaterialFileInputModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
