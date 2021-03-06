import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors, FormBuilder } from '@angular/forms';


import { AuthService } from '../../../shared/services/auth.service';
import { HeaderService } from '../../../shared/services/header.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public error: any = {};
  public userForm: FormGroup;
  public isFormSubmitting = false;

  constructor(private headerService: HeaderService,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router) {
    headerService.setHeaderState({close: true});
  }

  public ngOnInit() {

    this.buildUserForm();
  }

  public ngOnDestroy() {
    this.headerService.setHeaderState({open: true});
  }

  public passwordsMatchValidator(control: FormControl): ValidationErrors {
    const password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

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

  public register() {

    if (!this.userForm.valid) {
      return;
    }

    this.isFormSubmitting = true;

    const {
      fullname,
      email,
      password,
      repeatPassword
    } = this.userForm.getRawValue();

    this.authService.register(fullname, email, password, repeatPassword)
      .subscribe(data => {
        this.isFormSubmitting = false;
        this.router.navigate(['']);
      }, (error) => {
        this.error = error;
        this.isFormSubmitting = false;
      });
  }

  private buildUserForm(): void {
    this.userForm = this.fb.group({
      fullname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator])
    });
  }

}
