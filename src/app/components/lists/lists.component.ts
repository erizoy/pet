import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../../modules/shared/services/list/list.service';
import { SidebarService } from '../../modules/shared/services/sidebar/sidebar.service';
import { APP_CONFIG, AppConfig } from '../../models/app-config';

@Component({
  selector: 'two-todo-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent {
  newList = '';

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private router: Router,
    public listService: ListService,
    private sidebarService: SidebarService
  ) {}

  openList(uuid: string): void {
    this.router.navigate([`/${uuid}`]).then(() => {
      if (window.innerWidth <= this.config.mobileEndpoint) {
        this.sidebarService.drawer.close();
      }
    });

    return;
  }

  create(): void {
    if (this.newList.length > 0) {
      const uuid = this.listService.create(this.newList);

      this.router.navigate([`/${uuid}`]).then(() => {
        if (window.innerWidth <= this.config.mobileEndpoint) {
          this.sidebarService.drawer.close();
        }
        this.newList = '';
      });
    }
  }
}
