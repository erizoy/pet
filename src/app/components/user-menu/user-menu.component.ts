import { Component } from '@angular/core';
import { AuthService } from '../../modules/shared/services/auth/auth.service';

@Component({
  selector: 'pet-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {

  constructor(
    public auth: AuthService
  ) { }

  logout(): void {
    this.auth.logout().subscribe(_ => {});
  }

}
