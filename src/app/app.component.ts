import { Component } from '@angular/core';
import { AuthService } from './modules/shared/services/auth/auth.service';
import { ListService } from './modules/shared/services/list/list.service';

@Component({
  selector: 'pet-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public auth: AuthService,
    public listService: ListService
  ) {

  }
}
