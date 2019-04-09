import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Board } from '../../../models/board.model';
import { BoardService } from '../../services/board.service';
import { filter, finalize, mergeMap } from 'rxjs/internal/operators';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material';
import { AreYouSureDialogComponent } from '../are-you-sure-dialog/are-you-sure-dialog.component';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  public boardList: Observable<Board[]>;
  public activeBoard: Observable<Board>;
  public title = '';
  public sortBoardBy = 'createdAt';
  public sortBoardDirection = '1';
  public isBoardsDeleteProcess = false;

  public user: any;

  @ViewChild('sidenav') sidenav: any;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private boardService: BoardService,
              private authService: AuthService,
              private headerService: HeaderService,
              private breakpointObserver: BreakpointObserver) {}

  public ngOnInit() {

    // init this.user on startup
    this.authService.me().subscribe(data => {
      this.user = data.user;
    });

    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });

    this.boardService.getActiveBoard().subscribe((activeBoard) => {
      if (activeBoard) {
        this.title = activeBoard.name;
      } else {
        this.setTitle();
      }
    });

    this.setTitle();
    this.boardList = this.boardService.getActiveBoardsList();
  }

  public ngAfterViewInit() {

    this.headerService.getHeaderState().subscribe((state: any) => {

      setTimeout(() => {

        console.log('Header state ', state);

        if (state.open) {
          this.sidenav.open();
          return;
        }

        if (state.close) {
          this.sidenav.close();
          return;
        }

      });

    });

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

  public goToEditProfilePage(): void {
    this.router.navigate(['profile/edit']);
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
