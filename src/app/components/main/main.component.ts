import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { takeUntil } from 'rxjs/operators';
import { ListService } from '../../modules/shared/services/list/list.service';
import { BaseComponent } from '../../modules/shared/components/base/base.component';

@Component({
  selector: 'two-todo-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BaseComponent implements OnInit {

  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(public listService: ListService) {
    super();
  }

  ngOnInit(): void {

    this.listService.listStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        if (this.drawer) {
          this.drawer.toggle();
        }
      });
  }

}
