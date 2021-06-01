import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;
import { take, tap } from 'rxjs/operators';
import { LoaderService } from '../loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private angularFireAuth: AngularFireAuth,
    private loader: LoaderService
  ) {
    this.user$.pipe(take(1)).subscribe(_ => {
      this.loader.hide();
    })
  }

  get user$(): Observable<firebase.User | null> {
    return this.angularFireAuth.user;
  }

  login(email: string, password: string): Observable<UserCredential> {
    this.loader.show();
    return from(this.angularFireAuth.signInWithEmailAndPassword(email, password))
      .pipe(tap(()  => this.loader.hide()));
  }

  register(email: string, password: string): Observable<UserCredential> {
    return from(
      this.angularFireAuth.createUserWithEmailAndPassword(email, password)
    );
  }

  forgotPassword(email: string): Observable<void> {
    return from(
      this.angularFireAuth.sendPasswordResetEmail(email, null)
    );
  }

  resetPassword(code: string, newPassword: string): Observable<void> {
    return from(
      this.angularFireAuth.confirmPasswordReset(code, newPassword)
    );
  }

  logout(): Observable<unknown> {
    this.loader.show();
    return from(this.angularFireAuth.signOut())
      .pipe(tap(()  => this.loader.hide()));
  }

}
