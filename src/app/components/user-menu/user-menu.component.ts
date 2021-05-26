import { Component } from '@angular/core';
import { AuthService } from '../../modules/shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'two-todo-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {

  constructor(
    public router: Router,
    public auth: AuthService
  ) {}

  logout(): void {
    this.router.navigate(['/list']).then(() => { // This helps to unsubscribe from current list
      this.auth.logout().subscribe(_ => {
        this.router.navigate(['/login']);
      });
    });
  }

}
