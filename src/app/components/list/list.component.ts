import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../modules/shared/services/list/list.service';
import { TaskService } from '../../modules/shared/services/task/task.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../modules/shared/components/base/base.component';
import { SwipeEvent } from '../../models/swipe-event';
import { ListTask } from '../../models/list';

@Component({
  selector: 'pet-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  uuid!: string;
  newTask = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public listService: ListService,
    public taskService: TaskService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.uuid = params.get('uuid') as string;
        this.taskService.load(this.uuid);
        this.listService.setTitle(this.uuid);
      });
  }

  sortTasks(a: ListTask, b: ListTask): number {
    return b.status ? 1 : 0;
  }

  removeList(): void {
    this.listService.remove(this.uuid).then(() => {
      this.router.navigate(['/']);
    });
  }

  create(): void {
    if (this.newTask.length > 0) {
      this.taskService.create(this.newTask);
      this.newTask = '';
    }
  }

  remove(task: ListTask): void {
    this.taskService.remove(task);
  }

  toggleStatus(task: ListTask): void {
    this.taskService.toggleStatus(task);
  }

  processAction(event: SwipeEvent, task: ListTask): void {
    if (event === SwipeEvent.REMOVE) {
      this.remove(task);
      return;
    }

    if (event === SwipeEvent.TOGGLE) {
      this.toggleStatus(task);
      return;
    }
  }
}
