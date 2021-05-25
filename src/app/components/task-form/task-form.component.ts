import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { TaskService } from '../../modules/shared/services/task/task.service';
import { BaseComponent } from '../../modules/shared/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

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
    public taskService: TaskService
  ) {
    super();
  }

  create(): void {
    if (this.task.length > 0) {
      this.taskService.create(this.task, this.position);
      this.task = '';
      timer(100).pipe(takeUntil(this.destroy$)).subscribe(_  => {
        this.taskInput.nativeElement.scrollIntoView(true);
      });
    }
  }

}
