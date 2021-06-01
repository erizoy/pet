import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../shared/services/auth/auth.service';

type State = 'login' | 'register' | 'forgotPassword' | 'resetPassword';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  state: State = 'login';
  states: State[] = ['login', 'register', 'forgotPassword'];
  code?: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    const params = this.route.snapshot.queryParams;

    if (params.mode === 'resetPassword' && params.oobCode) {
      this.state = 'resetPassword';
      this.code = params.oobCode;

      this.router.navigate(
        ['.'],
        { relativeTo: this.route, queryParams: { } }
      );
    }
  }

  send(): void {
    const { email, password } = this.form.getRawValue();
    let request$: Observable<unknown>;

    switch (this.state) {
      case 'login':
        request$ = this.auth.login(email, password);
        break;
      case 'register':
        request$ = this.auth.register(email, password);
        break;
      case 'forgotPassword':
        request$ = this.auth.forgotPassword(email);
        break;
      case 'resetPassword':
        request$ = this.auth.resetPassword(this.code as string, password);
        break;
    }

    request$.subscribe(() => {
      if (['resetPassword', 'forgotPassword'].includes(this.state)) {
        this.translate.get(`LOGIN_FORM.SUCCESS.${this.state}`).pipe(take(1)).subscribe(message => {
          this.state = 'login';
          this.form.setValue({email: '', password: ''});
          this.snackBar.open(message);
        });
      } else {
        this.router.navigate(['/list']);
      }
    }, error => {
      this.form.setErrors({[error.code]: true});
      this.translate.get(`LOGIN_FORM.ERRORS.${error.code}`).pipe(take(1)).subscribe(message => {
        message = message.indexOf('ERRORS') > 0 ? error.message : message;

        this.snackBar.open(message, undefined, {
          panelClass: ['error-popup']
        });
      });
    });
  }

}
