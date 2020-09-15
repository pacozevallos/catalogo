import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss']
})
export class CrearProductoComponent implements OnInit {

  formProduct: FormGroup;
  @ViewChild('f') form;
  
  selectedFile: FileList | null;
  nameItem: any;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(
    private fb:FormBuilder,
    private fs: FirebaseService,
    private router: Router,
    // public dialogRef: MatDialogRef<CrearProductoComponent>,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.formProduct = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      image: ['', Validators.required],
      fechaCreacion: [firebase.firestore.Timestamp.fromDate(new Date())],
    })
  }

  onSubmit() {
    if (this.formProduct.valid) {
      this.uploadFileAndCrearProducto();
    } else {
      this.validateAllFormFields(this.formProduct);
    }
  }

  // crearProducto() {
  //   this.fs.addProduct(this.formProduct.value)
  //     .then(() => {
  //       this.dialogRef.close();
  //     });
  // }

  detectFiles(event) {
    this.selectedFile = event.target.files[0];
    this.nameItem = event.target.files[0].name;
    console.log(this.nameItem);
  }

  uploadFileAndCrearProducto() {
    const myTest = this.afs.collection('productos').ref.doc();
    console.log(myTest.id);

    const file = this.selectedFile;
    const filePath = `imagesProducts/${myTest.id}/${this.nameItem}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          this.downloadURL = url;
          myTest.set({
            titulo: this.formProduct.value.titulo,
            descripcion: this.formProduct.value.descripcion,
            precio: this.formProduct.value.precio,
            image: this.downloadURL,
            fechaCreacion: this.formProduct.value.fechaCreacion,
          });
          // this.dialogRef.close();
          console.log( this.downloadURL );
          this.form.resetForm({
            fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
          });
          this.snackBar.open('Producto creado', 'CERRAR', {
            duration: 8000,
          });
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

}
