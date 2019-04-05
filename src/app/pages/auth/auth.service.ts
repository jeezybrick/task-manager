import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { TokenStorage } from './token.storage';
import { BoardService } from '../../shared/services/board.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public $userSource: Subject<any> = new Subject();

  constructor(private http: HttpClient, private token: TokenStorage, private boardService: BoardService) {}

  login(email: string, password: string): Observable<any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/login', {
        email,
        password
      }).subscribe((data: any) => {
        observer.next({user: data.user});
        this.setUser(data.user);
        this.token.saveToken(data.token);
        this.boardService.getBoards().subscribe();
        observer.complete();
      });
    });
  }

  register(fullname: string, email: string, password: string, repeatPassword: string): Observable<any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/register', {
        fullname,
        email,
        password,
        repeatPassword
      }).subscribe((data: any) => {
        observer.next({user: data.user});
        this.setUser(data.user);
        this.token.saveToken(data.token);
        observer.complete();
      });
    });
  }

  setUser(user): void {

    if (user) {
      user.isAdmin = (user.roles.indexOf('admin') > -1);
    }

    this.$userSource.next(user);
  }

  getUser(): Observable<any> {
    return this.$userSource.asObservable();
  }

  me(): Observable<any> {
    return Observable.create(observer => {
      const tokenVal = this.token.getToken();
      if (!tokenVal) {
        return observer.complete();
      }
      this.http.get('/api/auth/me').subscribe((data: any) => {
        observer.next({user: data.user});
        this.setUser(data.user);
        observer.complete();
      });
    });
  }

  signOut(): void {
    this.token.signOut();
    this.setUser(null);
    this.boardService.setActiveBoardsList([]);
  }
}