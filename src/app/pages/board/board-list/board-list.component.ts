import { Component, OnInit } from '@angular/core';
import { Board } from '../../../models/board.model';
import { BoardService } from '../../../shared/services/board.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit {

  public boards: Board[] = [];
  public isBoardsListLoading = true;
  public isBoardsDeleteProcess = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private boardService: BoardService) {
  }

  ngOnInit() {
    this.getBoardList();
  }

  public goToCreateBoardPage(): void {
    this.router.navigate(['create'], { relativeTo: this.route});
  }

  public goToBoardPage(boardId: string): void {
     this.router.navigate([boardId], { relativeTo: this.route});
  }

  public deleteBoard(event: Event, boardId: string): void {

    event.stopPropagation();

    if (this.isBoardsDeleteProcess) {
      return;
    }

    this.isBoardsDeleteProcess = true;

    this.boardService.deleteBoard(boardId).subscribe((response: any) => {
      this.getBoardList();
      this.isBoardsDeleteProcess = false;
    },(error) => {
      this.isBoardsDeleteProcess = false;
    });
  }

  private getBoardList(): void {
    this.boardService.getActiveBoardsList().subscribe((response: Board[]) => {
      this.boards = response;
      this.isBoardsListLoading = false;
    }, (error) => {
      this.isBoardsListLoading = false;
    });

  }

}
