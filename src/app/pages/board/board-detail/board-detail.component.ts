import { Component, OnDestroy, OnInit } from '@angular/core';
import { Column } from '../../../models/column.model';
import { ColumnService } from '../../../shared/services/column.service';
import { CardService } from '../../../shared/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../../shared/services/board.service';
import { Board } from '../../../models/board.model';
import { finalize } from 'rxjs/internal/operators';
import { MatDialog } from '@angular/material';
import { AreYouSureDialogComponent } from '../../../shared/components/are-you-sure-dialog/are-you-sure-dialog.component';

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss']
})
export class BoardDetailComponent implements OnInit, OnDestroy {

  public board: Board;
  public columnName = '';
  public columns: Column[] = [];
  public isBoardLoading = true;
  public isCardPositionChangeProcess = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private boardService: BoardService,
              private columnService: ColumnService,
              private cardService: CardService) {
  }

  // функция, которая запускается разово вначале при создании компонента
  public ngOnInit() {

    this.route.params.subscribe((params) => {

      if (!('id' in params)) {
        this.router.navigate(['boards']);
      }

      this.getBoardDetail(params['id']);

    });

  }

  public ngOnDestroy() {
    this.boardService.setActiveBoard(null);
  }

  private getBoardDetail(boardId): void {
    this.boardService.getBoardDetail(boardId).subscribe((response: Board) => {
      if (response) {
        this.board = response;
        this.columns = [...response.columns];
        this.boardService.setActiveBoard(response);
      } else {
        this.router.navigate(['boards']);
      }

      this.isBoardLoading = false;
    }, (error) => {
      this.router.navigate(['boards']);
    });
  }

  // добавление колнки
  public addColumn(): any {

    // передаем имя колонки в сервис и возвращается обьект колонки
    this.columnService.createColumn(this.board._id, {name: this.columnName}).subscribe((response: Column) => {
      this.columns.push(response);
      // очищаем поле ввода
      this.columnName = '';
    });
  }

  public onCardMoved(data: {currentColumnId: string; previousColumnId: string; currentIndex: any; previousIndex: any; cardId: string}): void {

    if ((data.currentColumnId === data.previousColumnId && data.currentIndex === data.previousIndex) || this.isCardPositionChangeProcess) {
      return;
    }

    let card;
    let indexPreviousColumn;
    const indexCurrentColumn = this.columns.findIndex((item) => item._id === data.currentColumnId);

    if (data.currentColumnId !== data.previousColumnId) {
      indexPreviousColumn = this.columns.findIndex((item) => item._id === data.previousColumnId);
    } else {
      indexPreviousColumn = indexCurrentColumn;
    }

    card = this.columns[indexPreviousColumn].splice(data.previousIndex, 1)[0];
    this.columns[indexCurrentColumn].splice(data.currentIndex, 0, card);


    // this.isCardPositionChangeProcess = true;

    this.cardService.updatePosition(data)
      .pipe(finalize(() => setTimeout(() => {this.isCardPositionChangeProcess = false})))
      .subscribe((response) => {
        //this.columns = response;
      });
  }
  // удаление колонки
  public onRemoveColumn(columnId): void {

    const dialogRef = this.dialog.open(AreYouSureDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.columnService.deleteColumn(columnId).subscribe((response: Column[]) => {
          const index = this.columns.findIndex((item) => item._id === columnId);

          if (index > -1) {
            this.columns.splice(index, 1);
          }
        });
      }
    });

  }

}
