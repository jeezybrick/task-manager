import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Board } from '../../../models/board.model';
import { BoardService } from '../../services/board.service';
import { filter, finalize, mergeMap } from 'rxjs/internal/operators';
import { AuthService } from '../../../pages/auth/auth.service';
import { MatDialog } from '@angular/material';
import { AreYouSureDialogComponent } from '../are-you-sure-dialog/are-you-sure-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public boardList: Observable<Board[]>;
  public activeBoard: Observable<Board>;
  public title = '';
  public sortBoardBy = 'createdAt';
  public sortBoardDirection = '1';
  public isBoardsDeleteProcess = false;

  public user: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private boardService: BoardService,
              private authService: AuthService,
              private breakpointObserver: BreakpointObserver) {}

  public ngOnInit() {

    // init this.user on startup
    this.authService.me().subscribe(data => {
      this.user = data.user;
    });

    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });

    this.setTitle();
    this.boardList = this.boardService.getActiveBoardsList();
  }

  get isBoardPage(): boolean {
    return this.router.url === '/boards';
  }

  public goToCreateBoardPage(): void {
    this.router.navigate(['boards/create']);
  }

  public goToBoardsPage(): void {
    this.router.navigate(['boards']);
  }

  public logout(): void {
    this.authService.signOut();
    this.router.navigate(['/auth/login']);
  }

  public sortBoard(sortBy): void {

    if (this.sortBoardBy === sortBy) {
      this.sortBoardDirection =  this.sortBoardDirection === '1' ? '-1' : '1';
    } else {
      this.sortBoardDirection = '1';
    }

    this.sortBoardBy = sortBy;
    this.boardService.getBoards(sortBy, this.sortBoardDirection).subscribe();
  }

  public deleteBoard(event: Event, boardId: string): void {
    event.preventDefault();
    event.stopPropagation();

    const dialogRef = this.dialog.open(AreYouSureDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (this.isBoardsDeleteProcess) {
          return;
        }

        this.isBoardsDeleteProcess = true;

        this.boardService.deleteBoard(boardId)
          .pipe(finalize(() => setTimeout(() => {this.isBoardsDeleteProcess = false; }, 200)))
          .subscribe(() => {
           this.router.navigate(['boards']);
          });
      }
    });
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
