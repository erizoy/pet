import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatExpansionPanel } from '@angular/material/expansion';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';
import { ListService } from '../../modules/shared/services/list/list.service';
import { TaskService } from '../../modules/shared/services/task/task.service';
import { BaseComponent } from '../../modules/shared/components/base/base.component';
import { SwipeEvent } from '../../models/swipe-event';
import { ListTask } from '../../models/list';

@Component({
  selector: 'two-todo-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  @ViewChild('listFormPanel') listFormPanel!: MatExpansionPanel;

  constructor(
    private ngZone: NgZone,
    private route: ActivatedRoute,
    public listService: ListService,
    public taskService: TaskService
  ) {
    super();
  }

  ngOnInit(): void {
    // Subscription on list uuid changing in url
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const uuid = params.get('uuid') as string;
        this.taskService.load(uuid);
        this.listService.setList(uuid);
      });
  }

  removeList(): void {
    this.listService.remove();
  }

  remove(task: ListTask): void {
    this.taskService.remove(task);
  }

  toggleStatus(task: ListTask, tasks: ListTask[]): void {
    const previous = task.position;
    // When marking task as done - move it to the end of the list, otherwise - to the start
    const current = task.status ? 0 : tasks.length - 1;

    task.status = !task.status;
    // Cloning tasks array for prevent blinking
    this.drop(previous, current, [...tasks]);
  }

  toggleListForm(): void {
    this.listFormPanel.toggle();
  }

  processAction(event: SwipeEvent, task: ListTask, tasks: ListTask[]): void {
    if (event === SwipeEvent.REMOVE) {
      this.remove(task);
      return;
    }

    if (event === SwipeEvent.TOGGLE) {
      this.toggleStatus(task, tasks);
      return;
    }
  }

  drop(previous: number, current: number, tasks: ListTask[]): void {
    // native material method for moving element to a new position
    moveItemInArray(tasks, previous, current);

    // defining map of tasks for bulk update in list model
    const data: { [key: string]: Partial<ListTask> } = {};
    tasks.forEach((task, i) => {
      const { uuid, ...object } = task; // taking out uuid from task
      object.position = i; // updating task position
      data[uuid] = object; // add updated task into map
    });

    this.ngZone.runOutsideAngular(() => { // for better performance
      this.listService.update({tasks: data} as Partial<ListTask>);
    });
  }
}
