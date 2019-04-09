import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';


import { AuthService } from '../auth.service';
import { HeaderService } from '../../../shared/services/header.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  constructor(private headerService: HeaderService,
              private authService: AuthService,
              private router: Router) {
    headerService.setHeaderState({close: true});
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.headerService.setHeaderState({open: true});
  }

  passwordsMatchValidator(control: FormControl): ValidationErrors {
    const password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

  userForm = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator])
  });

  get fullname(): any {
    return this.userForm.get('fullname');
  }

  get email(): any {
    return this.userForm.get('email');
  }

  get password(): any {
    return this.userForm.get('password');
  }

  get repeatPassword(): any {
    return this.userForm.get('repeatPassword');
  }

  register() {

    if (!this.userForm.valid) {
      return;
    }

    const {
      fullname,
      email,
      password,
      repeatPassword
    } = this.userForm.getRawValue();

    this.authService.register(fullname, email, password, repeatPassword)
      .subscribe(data => {
        this.router.navigate(['']);
      });
  }

}
