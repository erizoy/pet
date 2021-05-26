import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from '../../models/app-config';
import { ListService } from '../../modules/shared/services/list/list.service';

@Component({
  selector: 'two-todo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent  {
  newList = '';

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private router: Router,
    public listService: ListService
  ) {}

  create(): void {
    if (this.newList.length > 0) {
      const uuid = this.listService.create(this.newList);

      this.router.navigate([`/list/${uuid}`]).then(() => {
        this.newList = '';
      });
    }
  }
}
