import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { Producto } from '../classes/producto';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  // addProduct(dataProduct) {
  //   return this.afs.collection('productos').add(dataProduct);
  // }


  // getAllProducts() {
  //   return this.afs.collection('productos', ref => ref
  //   .orderBy('nombre', 'asc')
  //   ).snapshotChanges().pipe(
  //     map(actions => actions.map(a => {
  //       const data = a.payload.doc.data() as any;
  //       const id = a.payload.doc.id;
  //       return { id, ...data };
  //     }))
  //   );
  // }

  addProduct(dataProduct) {
    return this.afs.collection('producto').add(dataProduct);
  }

  deleteProduct(idProduct) {
    return this.afs.collection('productos').doc(idProduct).delete();
  }

  deleteProductStorage(idProduct, imageName) {
    return this.storage.ref(`imagesProducts/${idProduct}/${imageName}`).delete();
  }

  updateProduct(idProduct, dataProduct) {
    return this.afs.collection('productos').doc(idProduct).update(dataProduct);
  }

  updateAprobado(idProducto, publicado) {
    this.afs.doc('productos/' + idProducto).update({publicado});
  }

  updateDestacado(idProducto, destacado) {
    this.afs.doc('productos/' + idProducto).update({destacado});
  }

  getAllProducts() {
    return this.afs.collection('productos', ref => ref
    .orderBy('nombre', 'asc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Producto;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getProducts() {
    return this.afs.collection('productos', ref => ref
    .where('publicado', '==', true)
    // .orderBy('nombre', 'asc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Producto;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }



}
