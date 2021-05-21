import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListTask } from '../../../../models/list';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  #listUuid?: string; // Selected list uuid
  #tasks?: any; // Reference to firebase rtdb list of list's tasks
  tasks$?: Observable<ListTask[]>; // Observable for list's tasks

  constructor(
    private db: AngularFireDatabase
  ) { }

  /**
   * Set current list uid, tasks reference and observable
   * @param listUuid - list uuid from current route
   */
  load(listUuid: string | null): void {
    if (listUuid) {
      this.#listUuid = listUuid;
      this.#tasks = this.db.list<ListTask>(`lists/${listUuid}/tasks`, (ref) => ref.orderByChild('status'));
      this.tasks$ = this.#tasks.valueChanges([], { idField: 'uuid'});
    } else {
      this.#listUuid = this.#tasks = this.tasks$ = undefined;
    }
  }

  /**
   * Creates new element in current list's tasks
   * @param text - text description of new task
   */
  create(text: string): void {
    this.#tasks.push({
      text,
      status: false
    });
  }

  /**
   * Removes selected task
   * @param task - selected task
   */
  remove(task: ListTask): void {
    this.db.object<ListTask>(`lists/${this.#listUuid}/tasks/${task.uuid}`).remove();
  }

  /**
   * Toggles status of selected task
   * @param task - selected task
   */
  toggleStatus(task: ListTask): void {
    this.db.object<ListTask>(`lists/${this.#listUuid}/tasks/${task.uuid}`).set({
      text: task.text,
      status: !task.status
    } as ListTask);
  }
}
