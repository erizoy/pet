import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SidebarService } from '../../modules/shared/services/sidebar/sidebar.service';
import { APP_CONFIG, AppConfig } from '../../models/app-config';

@Component({
  selector: 'two-todo-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  @HostListener('window:resize', ['$event'])
  onResize(): void { // toggles sidebar mode when window width crosses mobile endpoint
    if (this.drawer) {
      if (window.innerWidth > this.config.mobileEndpoint) {
        this.drawer.mode = 'side';
        this.drawer.opened = true;
      } else {
        this.drawer.opened = false;
        this.drawer.mode = 'over';
      }
    }
  }

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private cdRef: ChangeDetectorRef,
    private sidebarService: SidebarService
  ) {}

  ngAfterViewInit(): void {
    this.sidebarService.drawer = this.drawer;

    if (window.innerWidth > this.config.mobileEndpoint) {
      this.drawer.opened = true;
    }

    this.onResize();
    this.cdRef.detectChanges();
  }

}
