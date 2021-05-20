import { Component } from '@angular/core';
import { AuthService } from './modules/shared/services/auth/auth.service';
import { ListService } from './modules/shared/services/list/list.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'two-todo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    translate: TranslateService,
    public auth: AuthService,
    public listService: ListService
  ) {
    // setting language

    const lang = ['en', 'ru'].includes(translate.getBrowserLang()) ?
      translate.getBrowserLang() : // use browser language only if it is Russian or English
      'en'; // English is default for other cases

    translate.setDefaultLang(lang);
    translate.use(lang);
  }
}
