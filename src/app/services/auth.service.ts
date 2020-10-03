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
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );
  }

  // Métodos de autenticación
  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        this.pushUserDataProviders(credential.user);
        // this.router.navigate(['/publicarAviso']);
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  // Email/Password Auth
  emailSignUp(email: string, password: string, displayName: string) {
    this.displayName = displayName ;
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        this.pushUserDataEmail(credential.user);
        console.log('Usuario creado');
        // this.actualizarNombre();
        // this.router.navigate(['/publicarAviso']);
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  actualizarNombre(nombre: string) {
    const user = firebase.auth().currentUser;
    return user.updateProfile({
      displayName: nombre,
    });
  }

  emailLogin(email: string, password: string ) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        // this.notify.update('Welcome to Firestarter!!!', 'success');
        // return this.updateUserData(credential.user)
        // this.pushUserDataEmail(credential.user)
        console.log('Usuario logueado');
        this.router.navigate(['/publicarAviso']);
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  enviarResetPasswordEmail(email: string) {
    // return this.afs.collection('resetPassword').add(email);
    return this.afAuth.sendPasswordResetEmail(email)
    .then ( () => {
      console.log('Email para restablecer contraseña enviado.');
    })
    .catch(error => {
      this.handleError(error);
    });
  }

  private pushUserDataProviders( user: User ) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    userRef.set(data, {merge: true});
  }

  private pushUserDataEmail( user: User ) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: this.displayName
      // displayName: user.displayName
    };
    userRef.set(data, {merge: true});
  }

  signOut() {
    this.afAuth.signOut().then(() => {
        this.router.navigate(['/']);
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

    // Evitar conflicto con Facebook y Google
    let facebookCred = null;
    if (error.code === 'auth/account-exists-with-different-credential') {
      facebookCred = error.credential;
      const googleProvider = new firebase.auth.GoogleAuthProvider();
      googleProvider.setCustomParameters({ login_hint: error.email });
      return firebase.auth().signInWithPopup(googleProvider)
        .then( (result) => {
          return result.user.linkAndRetrieveDataWithCredential(facebookCred)
          .then(this.goToApp);
        });
    }
    throw error;
  }

  private goToApp() {
    this.router.navigate(['/publicarAviso']);
  }

  isAuth() {
    return this.afAuth.authState
    .pipe(
      map( fbUser => {
        if ( fbUser == null) {
          this.router.navigate(['/']);
          console.log('Usuario no logueado')
        }
        return fbUser != null;
      })
    );
  }

}
