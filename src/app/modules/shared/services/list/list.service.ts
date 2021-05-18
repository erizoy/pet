import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from '../../../../models/list';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AngularFireList } from '@angular/fire/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  #uid?: string;
  #lists?: AngularFireList<List> = this.db.list<List>(`lists`); // Add-hoc: If not define as ANY ref = permission denied error
  lists$?: Observable<List[]>;
  listStatus$ = new BehaviorSubject<boolean>(true);
  title$?: Observable<string | null>;

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private auth: AuthService
  ) {
    this.auth.user$.subscribe(user => {
      if (user && user.uid) {
        this.#uid = user.uid;
        this.#lists = this.db.list<List>(`lists/${this.#uid}`);
        this.lists$ = this.#lists.valueChanges([], { idField: 'uuid'});
      } else {
        this.#lists = this.lists$ = this.#uid = undefined;
      }
    });
  }

  toggleList(): void {
    const current = this.listStatus$.getValue();
    this.listStatus$.next(!current);
  }

  setTitle(uuid?: string): void {
    this.title$ = uuid ? this.lists$?.pipe(
      take(1),
      map(lists => lists.find(list => list.uuid === uuid)?.title || null)
    ) : undefined;
  }

  create(title: string): string | null {
    const data: Partial<List> = {
      title,
      userId: this.#uid as string
    };

    return (this.#lists as AngularFireList<List>).push(data as List).key;
  }

  remove(uuid: string): Promise<void> {
    return this.db.object<List>(`lists/${this.#uid}/${uuid}`).remove();
  }
}
