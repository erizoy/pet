import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../../modules/shared/services/list/list.service';
import { TaskService } from '../../modules/shared/services/task/task.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../modules/shared/components/base/base.component';
import { SwipeEvent } from '../../models/swipe-event';
import { ListTask } from '../../models/list';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'two-todo-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  @ViewChild('listFormPanel') listFormPanel!: MatExpansionPanel;

  constructor(
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
        const uuid = params.get('uuid') as string;
        this.taskService.load(uuid);
        this.listService.setList(uuid);
      });
  }

  sortTasks(a: ListTask, b: ListTask): number {
    return b.status ? 1 : 0;
  }

  removeList(): void {
    this.listService.remove();
  }

  remove(task: ListTask): void {
    this.taskService.remove(task);
  }

  toggleStatus(task: ListTask): void {
    this.taskService.toggleStatus(task);
  }

  toggleListForm(): void {
    this.listFormPanel.toggle();
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
