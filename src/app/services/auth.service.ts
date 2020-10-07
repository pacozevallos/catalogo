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
  ) { }


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

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        this.pushUserDataProviders(credential.user);
        this.router.navigate(['/admin/productos']);
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  pushUserDataProviders( user: User ) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    userRef.set(data, {merge: true});
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
