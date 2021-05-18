import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../../modules/shared/services/list/list.service';

@Component({
  selector: 'two-todo-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent {
  newList = '';

  constructor(
    private router: Router,
    public listService: ListService
  ) {}

  openList(uuid: string): void {
    this.router.navigate([`/${uuid}`]).then(() => {
      this.listService.toggleList();
    });
  }

  create(): void {
    if (this.newList.length > 0) {
      const uuid = this.listService.create(this.newList);

      this.router.navigate([`/${uuid}`]).then(() => {
        this.listService.toggleList();
        this.newList = '';
      });
    }
  }
}
