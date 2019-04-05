import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  email: string;
  password: string;

  ngOnInit() {}

  login(): void {
   /* const datta = {
      'user': {
        'roles': [], '_id': '5c948fb8ee31077ff721caa8',
        'fullname': 'Andrey Statsenko', 'email': 'smooker14@gmail.com',
        'createdAt': '2019-03-22T07:33:12.945Z'
      },
      'token': 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W10sIl9pZCI6IjVjOTQ4ZmI4ZWUzMTA3N2ZmNzIxY2FhOCIsImZ1bGxuYW1lIjoiQW5kcmV5IFN0YXRzZW5rbyIsImVtYWlsIjoic21vb2tlcjE0QGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMTktMDMtMjJUMDc6MzM6MTIuOTQ1WiJ9.57EbX7VXqRxBAIgM7Nop73SuBrNnNt_BI25x-jwaO3w'
    };

    this.authService.setUser(datta.user);*/
    this.authService.login(this.email, this.password)
    .subscribe(data => {
      console.log(data);
      this.router.navigate(['']);
    });
  }

}
