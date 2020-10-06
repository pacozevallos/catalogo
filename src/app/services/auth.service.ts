import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user;
  displayName: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public router: Router,
    public snackBar: MatSnackBar,
    public readonly ngZone: NgZone,
  ) {
    // this.user = this.afAuth.authState.pipe(
    //   switchMap(user => {
    //       if (user) {
    //         return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //       } else {
    //         return of(null);
    //       }
    //     })
    //   );
  }


  emailLogin(email: string, password: string ) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        // this.notify.update('Welcome to Firestarter!!!', 'success');
        // return this.updateUserData(credential.user)
        // this.pushUserDataEmail(credential.user)
        console.log('Usuario logueado');
        this.router.navigate(['/admin/productos']);
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  signOut() {
    this.afAuth.signOut().then(() => {
        this.router.navigate(['/login']);
    });
  }

  // Si hay un error, registro de consola y notificación con Mat SnackBar a Usuario
  private handleError(error) {
    console.error(error);

    // Utilizar ngZone para los SnackBar
    this.ngZone.run(() => {
      this.snackBar.open(error.message, 'CERRAR', {
        duration: 5000,
      });
    });
  }


}
