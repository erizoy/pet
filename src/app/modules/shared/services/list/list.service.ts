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
  #uid?: string; // Authenticated user id
  #email?: string; // Authenticated user email
  #listUuid?: string; // Selected list uuid
  #list?: AngularFireObject<List>; // Reference to firebase rtdb list
  #list$?: Subscription; // Subscription on selected list changes
  list$ = new BehaviorSubject<List | null>(null); // BehaviourSubject for selected list
  // Add-hoc: If not define as ANY ref = permission denied error
  #lists?: AngularFireList<List> = this.db.list<List>(`lists`); // Reference to firebase rtdb lists
  lists$?: Observable<List[]>; // Observable for all lists, where user is owner
  // Add-hoc: If not define as ANY ref = permission denied error
  #foreignLists?: AngularFireList<List> = this.db.list<List>(`lists`); // Reference to firebase rtdb lists where user is not owner
  foreignLists$?: Observable<List[]>; // Observable for all lists, where user is guest
  listStatus$ = new BehaviorSubject<boolean>(true); // Opened|Closed status of lists in sidebar

  #errorModal?: MatDialogRef<InfoModalComponent>; // Reference to opened error modal

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private auth: AuthService,
    private dialog: MatDialog
  ) {
    // Subscription on current authenticated user. Emits when on first load or after user's login.
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

  /**
   * Set current list uid, reference and subscription
   * @param listUuid - list uuid from current route
   */
  setList(listUuid: string | null): void {
    if (listUuid) {
      this.#listUuid = listUuid;
      this.#list = this.db.object<List>(`lists/${listUuid}`);
      this.#list$ = this.#list.valueChanges().pipe(catchError(this.errorHandler))
        .subscribe(list => this.list$.next(list && this.#email ? new List(list, this.#email) : null));
    } else {
      this.#list$?.unsubscribe();
      this.#list = this.#listUuid = undefined;
      this.list$.next(null);
    }
  }

  /**
   * Handler opens modal with error code when rtdb reference throws error
   * @param error - object from failed rtdb reference
   * @param caught - server response
   * @return Observable of caught
   */
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

  /**
   * Toggle state of lists in sidebar
   */
  toggleList(): void {
    const current = this.listStatus$.getValue();
    this.listStatus$.next(!current);
  }

  /**
   * Creates new element in user's lists
   * @param title - title for new list
   * @return uuid of created list
   */
  create(title: string): string | null {
    const data: Partial<List> = {
      title,
      userId: this.#uid as string
    };

    return (this.#lists as AngularFireList<List>).push(data as List).key;
  }

  /**
   * Updates old current list's field with new value.
   * @param data - `{title: 'new value'}` or `{guest: 'new value'}`
   * @return Promise without any data
   */
  update(data: Partial<List>): Promise<void> {
    return (this.#list as AngularFireObject<List>).update(data);
  }


  /**
   * Removes current list. If user is not owner of list - clear `list.guest`.
   * @return Promise without any data
   */
  remove(): Promise<void> {
    if (this.list$.getValue()?.guest === this.#email) {
      return this.update({ guest: '' });
    }

    return (this.#list as AngularFireObject<List>).remove();
  }
}
