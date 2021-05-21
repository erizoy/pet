import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TaskService } from '../../modules/shared/services/task/task.service';

@Component({
  selector: 'two-todo-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Input() position!: number;
  @ViewChild('taskInput') taskInput!: ElementRef;
  task = '';

  constructor(
    public taskService: TaskService
  ) { }

  create(): void {
    if (this.task.length > 0) {
      this.taskService.create(this.task, this.position);
      this.task = '';
      setTimeout(() => {
        this.taskInput.nativeElement.scrollIntoView(true);
      }, 100);
    }
  }

}
