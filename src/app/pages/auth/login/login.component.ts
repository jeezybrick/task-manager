import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../shared/services/auth.service';
import { HeaderService } from '../../../shared/services/header.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public error: any = {};
  public isFormSubmitting = false;

  constructor(private headerService: HeaderService,
              private authService: AuthService,
              private router: Router) {
    headerService.setHeaderState({close: true});
  }

  email: string;
  password: string;

  public ngOnInit() {}

  public ngOnDestroy() {
    this.headerService.setHeaderState({open: true});
  }

  public login(): void {
    this.error = {};
    this.isFormSubmitting = true;

    this.authService.login(this.email, this.password)
    .subscribe(data => {
      this.router.navigate(['']);
      this.isFormSubmitting = false;
    },(error) => {
      this.error = error;
      this.isFormSubmitting = false;
    });
  }

}
