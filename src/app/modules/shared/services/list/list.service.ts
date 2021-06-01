import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { AngularFireList } from '@angular/fire/database/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subscription, zip } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { BaseService } from '../base/base.service';
import { AuthService } from '../auth/auth.service';
import { MessageService } from '../message/message.service';
import { List } from '../../../../models/list';

@Injectable({
  providedIn: 'root'
})
export class ListService extends BaseService {
  #email: string | null = null; // Authenticated user email
  #token: string | null = null; // Authenticated user notification's token
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

  constructor(
    private db: AngularFireDatabase,
    private translate: TranslateService,
    private auth: AuthService,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    protected dialog: MatDialog
  ) {
    super(dialog);
    // Subscription on current authenticated user. Emits on first load or after user's login.
    zip(
      this.auth.user$,
      this.messageService.token$
    ).subscribe(data => {
      const [user, token] = data;

      if (user && user.email) {
        this.#email = user.email;
        this.#token = token;
        this.#lists = this.db.list<List>(`lists`, ref => ref.orderByChild('owner').equalTo(user.email));
        this.lists$ = this.#lists.valueChanges([], {idField: 'uuid'})
          .pipe(
            catchError(this.errorHandler.bind(this)),
            map(lists => lists.map(list => new List(list, user.email, token)))
          );
        this.#foreignLists = this.db.list<List>(`lists`, ref => ref.orderByChild('guest').equalTo(user.email));
        this.foreignLists$ = this.#foreignLists.valueChanges([], {idField: 'uuid'})
          .pipe(
            catchError(this.errorHandler.bind(this)),
            map(lists => lists.map(list => new List(list, user.email, token)))
          );
      } else {
        this.#lists = this.lists$ = undefined;
        this.#email = this.#token = null;
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
      this.#list$?.unsubscribe();
      this.#list$ = this.#list.valueChanges().pipe(catchError(this.errorHandler.bind(this)))
        .subscribe(list => this.list$.next(list ? new List(list, this.#email, this.#token) : null));
    } else {
      this.#list$?.unsubscribe();
      this.list$.next(null);
    }
  }

  /**
   * Creates new element in user's lists
   * @param title - title for new list
   * @return uuid of created list
   */
  create(title: string): string | null {
    const data: Partial<List> = {
      title,
      owner: this.#email as string
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

  /**
   * Send push notification to owner or guest if someone are subscribed.
   * @param body - task text
   */
  notifySubscribers(body: string): void {
    const list = this.list$.getValue()!;
    const receiverToken = list.isOwner ? list.subscribers.guest : list.subscribers.owner;

    if (receiverToken) {
      this.messageService
        .send(receiverToken, { title: list.title, body, tag: this.#listUuid })
        .pipe(take(1))
        .subscribe();
    }
  }

  /**
   * Subscribes owner or guest for current list updates.
   * @param list current list
   */
  toggleSubscription(list: List): void {
    const update = (token: string | null) => {
      this.update({
        subscribers: {
          owner: list.isOwner ? token : list.subscribers.owner,
          guest: list.isGuest ? token : list.subscribers.guest
        }
      });
    }

    if (!this.#token) { // if no permission - asks for token
      this.messageService.requestToken().subscribe(token => {
        this.#token = token;

        if (token) { // notification permission allowed
          update(token);
        } else { // permission denied
          this.translate.get('LIST.ERROR_NOTIFICATION').pipe(take(1)).subscribe(message => {
            this.snackBar.open(message, undefined, {
              panelClass: ['error-popup']
            });
          })
        }
      });
    } else { // clear token if already subscribed or put existed
      update(list.subscribed ? null : this.#token);
    }

  }
}
