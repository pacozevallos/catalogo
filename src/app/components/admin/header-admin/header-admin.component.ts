import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent implements OnInit {

  userId: string;
  displayName: string;
  email: string;
  photoURL: string;

  constructor(
    public auth: AuthService,
    public afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe( user => {
      if (user) {
        this.userId = user.uid;
        this.displayName = user.displayName;
        this.email = user.email;
        this.photoURL = user.photoURL;
      }
      console.log(user.uid);
    });
  }

  logout() {
    this.auth.signOut();
  }

}
