import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { Board } from '../models/board.model';
import { BoardService } from '../shared/services/board.service';
import { filter, mergeMap } from 'rxjs/internal/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  public boardList: Observable<Board[]>;
  public activeBoard: Observable<Board>;
  public title = '';

  @Input() public user: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private boardService: BoardService,
              private authService: AuthService,
              private breakpointObserver: BreakpointObserver) {}

  public ngOnInit() {

    this.setTitle();
    this.boardList = this.boardService.getActiveBoardsList();

   //  this.activeBoard = this.boardService.getActiveBoard();
  }

  public goToCreateBoardPage(): void {
    this.router.navigate(['boards/create']);
  }

  public logout(): void {
    this.authService.signOut();
    this.router.navigate(['/auth/login']);
  }

  private setTitle(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.firstChild;
          let child = route;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
              route = child;
            } else {
              child = null;
            }
          }
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe((data: any) => {
        this.title = data.title;
      });
  }

}
