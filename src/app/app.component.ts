import { ChangeDetectorRef, Component, HostListener, Inject, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from './modules/shared/services/auth/auth.service';
import { ListService } from './modules/shared/services/list/list.service';
import { SidebarService } from './modules/shared/services/sidebar/sidebar.service';
import { APP_CONFIG, AppConfig } from './models/app-config';

@Component({
  selector: 'two-todo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidebar') sidebar?: MatDrawer;
  @HostListener('window:resize', ['$event'])
  checkSidebar(): void { // toggles sidebar mode when window width crosses mobile endpoint
    if (this.sidebar) {
      if (window.innerWidth > this.config.mobileEndpoint && !this.sidebar.opened) {
        this.sidebar.open();
      } else if (window.innerWidth <= this.config.mobileEndpoint && this.sidebar.opened) {
        this.sidebar.close();
      }
    }
  }

  get sidebarMode(): 'side' | 'over' {
    return  window.innerWidth > this.config.mobileEndpoint ? 'side' : 'over';
  }

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    translate: TranslateService,
    router: Router,
    private cdRef: ChangeDetectorRef,
    public auth: AuthService,
    public listService: ListService,
    private sidebarService: SidebarService
  ) {
    // setting language

    const lang = ['en', 'ru'].includes(translate.getBrowserLang()) ?
      translate.getBrowserLang() : // use browser language only if it is Russian or English
      'en'; // English is default for other cases

    translate.setDefaultLang(lang);
    translate.use(lang);

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setSidebar();
        this.checkSidebar();

        if (window.innerWidth <= this.config.mobileEndpoint) {
          this.sidebar?.close(); // Sidebar closes every time when route changes on mobile
        }
      }
    });
  }

  setSidebar(): void {
    if (!this.sidebarService.sidebarRef && this.sidebar) { // Define sidebar reference in service
      this.sidebarService.sidebarRef = this.sidebar;

      if (window.innerWidth > this.config.mobileEndpoint) {
        this.sidebar.open();
      }

      this.checkSidebar();
      this.cdRef.detectChanges();
    }
  }
}
