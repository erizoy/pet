import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ListService } from '../../../shared/services/list/list.service';
import { List } from '../../../../models/list';

@Component({
  selector: 'two-todo-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent extends BaseComponent {
  @Input() panel!: MatExpansionPanel; // parent element reference
  @Input() list!: List;
  title?: string;
  guest?: string;

  constructor(
    private router: Router,
    private listService: ListService
  ) {
    super();
    this.listService.list$
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        if (list) {
          this.title = list.title;
          this.guest = list.guest;
        }
      });
  }

  update(data: Partial<List>): void {
    if (this.title !== this.list.title || this.guest !== this.list.guest) {
      this.listService.update(data);
    }
  }

  remove(): void {
    this.listService.remove();
    this.router.navigate(['/list']);
  }

  toggleSubscription(checkboxChange: MatCheckboxChange) {
    checkboxChange.source.checked = false;
    this.listService.toggleSubscription(this.list);
  }
}
