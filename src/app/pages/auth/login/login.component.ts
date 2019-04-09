import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {AuthService} from '../auth.service';
import { HeaderService } from '../../../shared/services/header.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private headerService: HeaderService,
              private authService: AuthService,
              private router: Router) {
    headerService.setHeaderState({close: true});
  }

  email: string;
  password: string;

  ngOnInit() {}

  ngOnDestroy() {
    this.headerService.setHeaderState({open: true});
  }

  login(): void {
    this.authService.login(this.email, this.password)
    .subscribe(data => {
      this.router.navigate(['']);
    });
  }

}
