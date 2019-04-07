import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { MatDialog } from '@angular/material';
import { BoardCardDialogComponent } from '../board-card-dialog/board-card-dialog.component';
import { Column } from '../../../models/column.model';
import { Card } from '../../../models/card.model';
import { CardService } from '../../../shared/services/card.service';
import { AreYouSureDialogComponent } from '../../../shared/components/are-you-sure-dialog/are-you-sure-dialog.component';
import { finalize } from 'rxjs/internal/operators';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss']
})
export class BoardColumnComponent implements OnInit {

  // декоратор, данные с файла html в column
  @Input() public column: Column;
  @Input() public isCardPositionChangeProcess: boolean;

  // декоратор, данные с этого компонент в родительский
  @Output() public columnDeleted = new EventEmitter<string>();
  @Output() public cardDeleted = new EventEmitter<any>();
  @Output() public cardMoved = new EventEmitter<any>();

  public cardName = '';
  public isCreateCardProcess = false;
  public isDeleteCardProcess = false;

  constructor(private cardService: CardService,
               public dialog: MatDialog) { }

  public ngOnInit() { }

  // добавление карточки
  public addCard(): void {

    if (this.isCreateCardProcess) {
      return;
    }

    this.isCreateCardProcess = true;

    // передаем имя карточки в сервис и возвращается обьект карточки
    this.cardService.createCard(this.column._id, {name: this.cardName})
      .pipe(finalize(() => setTimeout(() => {this.isCreateCardProcess = false; }, 200)))
      .subscribe((response: Card) => {

        this.column.cards.push(response);
        // очищаем поле ввода
        this.cardName = '';

        this.isCreateCardProcess = false;
    });
  }

  // передача сигнала удаления в родительский компонент(контейнер)
  public removeColumn(): void {
    this.columnDeleted.emit(this.column._id);
  }

  // удаление карточки, при передачи сигнала с карточки
  public onCardDeleted(cardId: string): void {

    const dialogRef = this.dialog.open(AreYouSureDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.isDeleteCardProcess) {
          return;
        }

        this.isDeleteCardProcess = true;

        this.cardService.deleteCard(cardId)
          .pipe(finalize(() => setTimeout(() => {this.isDeleteCardProcess = false; }, 500)))
          .subscribe((response) => {
            this.column.cards = response;
          });
      }
    });

  }

  // перетаскивание карточки
  public cardMove(event: CdkDragDrop<string[]>) {

    const previousColumnData: any = {...event.previousContainer.data};
    const currentColumnData: any = {...event.container.data};
    const card: any = {...event.item.data};

    this.cardMoved.emit({
      previousColumnId: previousColumnData._id,
      currentColumnId: currentColumnData._id,
      currentIndex: event.currentIndex + 1,
      previousIndex:  event.previousIndex + 1,
      cardId: card._id,
    });

  }

  public openCardDialog(card: Card): void {

    // Открываем окно с карточкой
    this.dialog.open(BoardCardDialogComponent, {
      panelClass: 'card-dialog',
      data: { card }
    });

  }

}
