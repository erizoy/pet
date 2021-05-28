import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireList } from '@angular/fire/database/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from '../base/base.service';
import { AuthService } from '../auth/auth.service';
import { Note } from '../../../../models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService extends BaseService {
  #uid?: string; // Authenticated user id
  #notes?: AngularFireList<Note> = this.db.list<Note>(`notes`); // Reference to firebase rtdb notes
  #notes$?: Subscription; // Subscription on notes changes
  notes$ = new BehaviorSubject<Note[]>([]); // Behavior subject for all notes, where user is owner
  filteredNotes$ = new BehaviorSubject<Note[]>([]); // Behavior subject for all filtered notes, where user is owner
  hashtags$ = new BehaviorSubject<string[]>([]); // Behavior subject for all note's hashtags

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private auth: AuthService,
    protected dialog: MatDialog
  ) {
    super(dialog);
    // Subscription on current authenticated user. Emits on first load or after user's login.
    this.auth.user$.subscribe(user => {
      if (user && user.uid) {
        this.#uid = user.uid;
        this.#notes = this.db.list<Note>(`notes`, ref => ref.orderByChild('userId').equalTo(user.uid));
        this.#notes$?.unsubscribe();
        this.#notes$ = this.#notes.valueChanges([], {idField: 'uuid'}).pipe(
          catchError(this.errorHandler.bind(this)),
          map(notes => notes.reverse().map(note => new Note(note))),
          tap(notes => {
            const hashtags = notes // Collecting all hashtags from all notes
              .reduce((acc: string[], note: Note) => {
                if (note.hashtags.length > 0) {
                  acc.push(...note.hashtags);
                }

                return acc;
              }, []) // Making hashtag values in array unique
              .filter((hashtag, i, array) => array.indexOf(hashtag) === i);

            this.hashtags$.next(hashtags);
          })
        ).subscribe(notes => {
          this.notes$.next(notes);
          this.filteredNotes$.next(notes);
        });
      } else {
        this.#notes = this.#uid = undefined;
        this.#notes$?.unsubscribe();
        this.notes$.next([]);
        this.filteredNotes$.next([]);
        this.hashtags$.next([]);
      }
    });
  }

  /**
   * Creates new element in user's notes
   * @return uuid of created list
   */
  create(): string | null {
    const data: Partial<Note> = {
      text: '',
      userId: this.#uid as string,
      hashtags: []
    };

    return (this.#notes as AngularFireList<Note>).push(data as Note).key;
  }

  /**
   * Updates selected note's field with new value.
   * @param uuid - uuid of selected note
   * @param data - `{text: 'new value'}` or `{hashtag: 'new value'}`
   * @return Promise without any data
   */
  update(uuid: string, data: Partial<Note>): Promise<void> {
    return this.db.object<Note>(`notes/${uuid}`).update(data);
  }

  /**
   * Removes selected note.
   * @param uuid - uuid of selected note
   * @return Promise without any data
   */
  remove(uuid: string): Promise<void> {
    return this.db.object<Note>(`notes/${uuid}`).remove();
  }

  /**
   * Filter all notes with selected hashtags.
   * @param hashtags - array of selected hashtags
   */
  filter(hashtags: string[]): void {
    const notes = this.notes$.getValue().filter(note => {
      return hashtags.reduce((acc, cur) => {
        if (note.hashtags.includes(cur)) {
          acc.splice(acc.indexOf(cur), 1);
        }
        return acc;
      }, [...hashtags]).length === 0;
    });
    this.filteredNotes$.next(notes);
  }
}
