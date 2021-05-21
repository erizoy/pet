import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { takeUntil } from 'rxjs/operators';
import { ListService } from '../../modules/shared/services/list/list.service';
import { BaseComponent } from '../../modules/shared/components/base/base.component';
import { APP_CONFIG, AppConfig, TWO_TODO_CONFIG } from '../../models/app-config';

@Component({
  selector: 'two-todo-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [{provide: APP_CONFIG, useValue: TWO_TODO_CONFIG}]
})
export class MainComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('drawer') drawer!: MatDrawer;
  @HostListener('window:resize', ['$event'])
  onResize(): void { // toggles sidebar mode when window width crosses mobile endpoint
    if (this.drawer) {
      if (window.innerWidth > this.config.mobileEndpoint) {
        this.drawer.mode = 'side';
        this.drawer.opened = true;
      } else {
        this.drawer.mode = 'over';
      }
    }
  }

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private cdRef: ChangeDetectorRef,
    public listService: ListService
  ) {
    super();
  }

  ngOnInit(): void {
    this.listService.listStatus$ // Listens changing and toggles sidebar
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        if (this.drawer) {
          this.drawer.toggle();
        }
      });
  }

  ngAfterViewInit(): void {
    this.onResize();
    this.cdRef.detectChanges();
  }

}
