import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  addProduct(dataProduct) {
    return this.afs.collection('productos').add(dataProduct);
  }

  getAllProducts() {
    return this.afs.collection('productos', ref => ref
    .orderBy('nombre', 'asc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }



}
