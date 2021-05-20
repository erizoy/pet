import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { List } from '../../../../models/list';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AngularFireList } from '@angular/fire/database/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog/dialog-ref';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  #uid?: string;
  #email?: string;
  #listUuid?: string;
  #list?: AngularFireObject<List>;
  #list$?: Subscription;
  list$ = new BehaviorSubject<List | null>(null);
  #lists?: AngularFireList<List> = this.db.list<List>(`lists`); // Add-hoc: If not define as ANY ref = permission denied error
  lists$?: Observable<List[]>;
  #foreignLists?: AngularFireList<List> = this.db.list<List>(`lists`); // Add-hoc: If not define as ANY ref = permission denied error
  foreignLists$?: Observable<List[]>;
  listStatus$ = new BehaviorSubject<boolean>(true);

  #errorModal?: MatDialogRef<InfoModalComponent>;

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private auth: AuthService,
    private dialog: MatDialog
  ) {
    this.auth.user$.subscribe(user => {
      if (user && user.uid) {
        this.#uid = user.uid;
        this.#email = user.email as string;
        this.#lists = this.db.list<List>(`lists`, ref => ref.orderByChild('userId').equalTo(user.uid));
        this.lists$ = this.#lists.valueChanges([], {idField: 'uuid'}).pipe(catchError(this.errorHandler));
        this.#foreignLists = this.db.list<List>(`lists`, ref => ref.orderByChild('guest').equalTo(user.email));
        this.foreignLists$ = this.#foreignLists.valueChanges([], {idField: 'uuid'}).pipe(catchError(this.errorHandler));
      } else {
        this.#lists = this.lists$ = this.#uid = this.#email = undefined;
      }
    });
  }

  setList(uuid: string | null): void {
    if (uuid) {
      this.#listUuid = uuid;
      this.#list = this.db.object<List>(`lists/${uuid}`);
      this.#list$ = this.#list.valueChanges().pipe(catchError(this.errorHandler))
        .subscribe(list => this.list$.next(list && this.#email ? new List(list, this.#email) : null));
    } else {
      this.#list$?.unsubscribe();
      this.#list = this.#listUuid = undefined;
      this.list$.next(null);
    }
  }

  private errorHandler<T>(error: any, caught: Observable<T>): Observable<T> {
    if (!this.#errorModal) {
      this.#errorModal = this.dialog.open(InfoModalComponent, {
        width: '340px',
        data: { error }
      });
    }

    this.#errorModal.afterClosed().subscribe(_ => {
      this.#errorModal = undefined;
    });

    return caught;
  }

  toggleList(): void {
    const current = this.listStatus$.getValue();
    this.listStatus$.next(!current);
  }

  create(title: string): string | null {
    const data: Partial<List> = {
      title,
      userId: this.#uid as string
    };

    return (this.#lists as AngularFireList<List>).push(data as List).key;
  }

  update(data: Partial<List>): Promise<void> {
    return (this.#list as AngularFireObject<List>).update(data);
  }

  remove(): Promise<void> {
    if (this.list$.getValue()?.guest === this.#email) {
      return this.update({ guest: '' });
    }

    return (this.#list as AngularFireObject<List>).remove();
  }
}
