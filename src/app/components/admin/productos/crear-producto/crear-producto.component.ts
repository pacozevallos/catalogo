import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { FileValidator } from 'ngx-material-file-input';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss']
})
export class CrearProductoComponent implements OnInit {

  formProduct: FormGroup;
  // tipos = [
  //   'Presentación única',
  //   'Presentación múltiple'
  // ];
  // medidas = [
  //   'Kg.', 'Ml.', 'Tab.'
  // ];
  visible = false;
  deshabilitado = false;
  selectedFile: FileList | null;
  nameItem: any;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  // 1 MB
  readonly maxSize = 1048576;
  actualSize: any;

  animales;
  categorias;
  marcas;
  tipos;
  medidas;

  constructor(
    private fs: FirebaseService,
    private ds: DataService,
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<CrearProductoComponent>,
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.formProduct = this.fb.group({
      categoria: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [''],
      image: [ '', [Validators.required, FileValidator.maxContentSize(this.maxSize)]],
      publicado: [false],
      destacado: [false],
      fechaCreacion: [firebase.firestore.Timestamp.fromDate(new Date())],
    });

    this.categorias = this.ds.categorias;
  }

  onSubmit() {
    if (this.formProduct.valid) {
      this.uploadFileAndCrearProducto();
      this.deshabilitado = true;
    } else {
      this.validateAllFormFields(this.formProduct);
      this.deshabilitado = false;
    }
  }

  crearProducto() {
    this.fs.addProduct(this.formProduct.value)
      .then(() => {
        this.dialogRef.close();
      });
  }

  detectFiles(event) {
    this.selectedFile = event.target.files[0];
    this.nameItem = event.target.files[0].name;
    console.log(this.nameItem);
  }

  uploadFileAndCrearProducto() {
    const myTest = this.afs.collection('productos').ref.doc();
    console.log(myTest.id);

    const file = this.selectedFile;
    // const filePath = `imagesProducts/${myTest.id}/name1`;
    const filePath = `imagesProducts/${myTest.id}/${this.nameItem}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          this.downloadURL = url;
          myTest.set({
            categoria: this.formProduct.value.categoria,
            nombre: this.formProduct.value.nombre,
            descripcion: this.formProduct.value.descripcion,
            image: this.downloadURL,
            imageName: this.nameItem,
            precio: this.formProduct.value.precio,
            publicado: this.formProduct.value.publicado,
            destacado: this.formProduct.value.destacado,
            fechaCreacion: this.formProduct.value.fechaCreacion,
          });
          this.dialogRef.close();
          console.log( this.downloadURL );
        }).catch(err => { console.log(err); } );
      })
    )
    .subscribe();
  }


  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  agregarPresentacion() {
    // tslint:disable-next-line:no-string-literal
    (this.formProduct.controls['presentaciones'] as FormArray).push(
      this.fb.group({
        presentacion: [''],
        medida: [''],
        precio: ['']
      })
    );
  }

  eliminarPresentacion(index: number): void {
    // tslint:disable-next-line:no-string-literal
    // (this.formProduct.controls['presentaciones']as FormArray).removeAt(index);
    const control = this.formProduct.controls.presentaciones as FormArray;
    control.removeAt(index);
  }

  cancelar() {
    this.dialogRef.close();
  }

  errorImagen() {
    return this.formProduct.controls.image.hasError('required') ? 'La imagen es necesaria' :
    this.formProduct.controls.image.hasError('maxContentSize') ? 'El peso de la imagen no debe exceder a 1 MB' : '';
  }

}
