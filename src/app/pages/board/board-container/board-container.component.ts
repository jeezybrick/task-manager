import { Component, OnInit } from '@angular/core';
import { Column } from '../../../models/column.model';
import { ColumnService } from '../../../shared/services/column.service';
import { CardService } from '../../../shared/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../../shared/services/board.service';
import { Board } from '../../../models/board.model';

@Component({
  selector: 'app-board-container',
  templateUrl: './board-container.component.html',
  styleUrls: ['./board-container.component.scss']
})
export class BoardContainerComponent implements OnInit {

  public board: Board;
  public columnName = '';
  public columns: Column[] = [];
  public isBoardLoading = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
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

  private getBoardDetail(boardId): void {
    this.boardService.getBoardDetail(boardId).subscribe((response: Board) => {
      this.board = response;
      this.columns = [...response.columns];
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

  // удаление колонки
  public onRemoveColumn(columnId): void {

    this.columnService.deleteColumn(columnId).subscribe((response: Column[]) => {
      const index = this.columns.findIndex((item) => item._id === columnId);

      if (index > -1) {
        this.columns.splice(index, 1);
      }
    });
  }


}
