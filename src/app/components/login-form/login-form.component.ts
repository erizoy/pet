import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../modules/shared/services/auth/auth.service';

@Component({
  selector: 'two-todo-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  login(): void {
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe(_ => {
      this.router.navigate(['/']);
    }, error => {
      if (['auth/user-not-found', 'auth/wrong-password'].includes(error.code)) {
        this.form.setErrors({wrongPassword: true});
      }
    });
  }

}
