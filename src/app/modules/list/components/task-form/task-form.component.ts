import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListService } from '../../../shared/services/list/list.service';
import { TaskService } from '../../../shared/services/task/task.service';
import { BaseComponent } from '../../../shared/components/base/base.component';

@Component({
  selector: 'two-todo-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent extends BaseComponent {
  @Input() position!: number;
  @ViewChild('taskInput') taskInput!: ElementRef;
  task = '';

  constructor(
    private listService: ListService,
    public taskService: TaskService
  ) {
    super();
  }

  create(): void {
    if (this.task.length > 0) {
      this.taskService.create(this.task, this.position);
      this.listService.notifySubscribers(this.task);
      this.task = '';
      // Mobile devices fallback - scroll to task's input after creation
      timer(100).pipe(takeUntil(this.destroy$)).subscribe(_  => {
        this.taskInput.nativeElement.scrollIntoView(true);
      });
    }
  }

}
