import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private angularFireAuth: AngularFireAuth
  ) {}

  get user$(): Observable<firebase.User | null> {
    return this.angularFireAuth.user;
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(
      this.angularFireAuth.signInWithEmailAndPassword(email, password)
    );
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
    return from(
      this.angularFireAuth.signOut()
    );
  }

}
