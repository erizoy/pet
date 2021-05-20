import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../../modules/shared/services/list/list.service';
import { List } from '../../models/list';
import { BaseComponent } from '../../modules/shared/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'two-todo-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent extends BaseComponent {
  #list?: List | null;
  title?: string;
  guest?: string;
  isGuest = false;

  constructor(
    private router: Router,
    private listService: ListService
  ) {
    super();
    this.listService.list$
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.#list = list;

        if (list) {
          this.title = list.title;
          this.guest = list.guest;
          this.isGuest = list.isGuest;
        }
      });
  }

  update(data: Partial<List>): void {
    if (this.title !== this.#list?.title || this.guest !== this.#list?.guest) {
      this.listService.update(data);
    }
  }

  remove(): void {
    this.listService.remove();
    this.router.navigate(['/']);
  }

}
