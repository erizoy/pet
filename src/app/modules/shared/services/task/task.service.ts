import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListTask } from '../../../../models/list';
import { AngularFireDatabase } from '@angular/fire/database';
import { BaseService } from '../base/base.service';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService {
  #listUuid?: string; // Selected list uuid
  #tasks?: any; // Reference to firebase rtdb list of list's tasks
  tasks$?: Observable<ListTask[]>; // Observable for list's tasks

  constructor(
    private db: AngularFireDatabase,
    protected dialog: MatDialog
  ) {
    super(dialog);
  }

  /**
   * Set current list uid, tasks reference and observable
   * @param listUuid - list uuid from current route
   */
  load(listUuid: string | null): void {
    if (listUuid) {
      this.#listUuid = listUuid;
      this.#tasks = this.db.list<ListTask>(`lists/${listUuid}/tasks`, (ref) => ref.orderByChild('position'));
      this.tasks$ = this.#tasks.valueChanges([], { idField: 'uuid'}).pipe(catchError(this.errorHandler.bind(this)));
    } else {
      this.#listUuid = this.#tasks = this.tasks$ = undefined;
    }
  }

  /**
   * Creates new element in current list's tasks
   * @param text - text description of new task
   * @param position - position (priority) of new task
   * @return uuid of created task
   */
  create(text: string, position: number): string | null {
    return this.#tasks.push({
      text,
      position,
      status: false
    }).key;
  }

  /**
   * Removes selected task
   * @param task - selected task
   * @return Promise without any data
   */
  remove(task: ListTask): Promise<void> {
    return this.db.object<ListTask>(`lists/${this.#listUuid}/tasks/${task.uuid}`).remove();
  }

  /**
   * Updates selected task's field with new value.
   * @param taskUuid - selected task uuid
   * @param data - `{text: 'new value'}` or `{status: 'new value'}`
   * @return Promise without any data
   */
  update(taskUuid: string, data: Partial<ListTask>): Promise<void> {
    return this.db.object<ListTask>(`lists/${this.#listUuid}/tasks/${taskUuid}`).update(data);
  }
}
