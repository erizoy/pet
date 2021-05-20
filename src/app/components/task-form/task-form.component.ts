import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../modules/shared/services/task/task.service';

@Component({
  selector: 'two-todo-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  task = '';

  constructor(
    public taskService: TaskService
  ) { }

  ngOnInit(): void {
  }

  create(): void {
    if (this.task.length > 0) {
      this.taskService.create(this.task);
      this.task = '';
    }
  }

}
