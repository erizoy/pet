import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListTask } from '../../../../models/list';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  #listUuid?: string;
  #tasks?: any;
  tasks$?: Observable<ListTask[]>;

  constructor(
    private db: AngularFireDatabase
  ) { }

  load(listUuid: string | null): void {
    if (listUuid) {
      this.#listUuid = listUuid;
      this.#tasks = this.db.list<ListTask>(`lists/tasks/${listUuid}`, (ref) => ref.orderByChild('status'));
      this.tasks$ = this.#tasks.valueChanges([], { idField: 'uuid'});
    } else {
      this.#listUuid = this.#tasks = this.tasks$ = undefined;
    }
  }

  create(text: string): void {
    this.#tasks.push({
      text,
      status: false
    });
  }

  remove(task: ListTask): void {
    this.db.object<ListTask>(`lists/tasks/${this.#listUuid}/${task.uuid}`).remove();
  }

  toggleStatus(task: ListTask): void {
    this.db.object<ListTask>(`lists/tasks/${this.#listUuid}/${task.uuid}`).set({
      text: task.text,
      status: !task.status
    } as ListTask);
  }
}
