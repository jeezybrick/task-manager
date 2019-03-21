import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { MatDialog } from '@angular/material';
import { BoardCardDialogComponent } from '../board-card-dialog/board-card-dialog.component';
import { Column } from '../../../models/column.model';
import { Card } from '../../../models/card.model';
import { CardService } from '../../../shared/services/card.service';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss']
})
export class BoardColumnComponent implements OnInit {

  // декоратор, данные с файла html в column
  @Input() public column: Column;

  // декоратор, данные с этого компонент в родительский
  @Output() public columnDeleted = new EventEmitter<string>();
  @Output() public cardDeleted = new EventEmitter<any>();
  @Output() public cardMoved = new EventEmitter<any>();

  public cardName = '';
  public isCreateCardProcess = false;
  public isDeleteCardProcess = false;

  constructor(private cardService: CardService, public dialog: MatDialog) { }

  public ngOnInit() { }

  // добавление карточки
  public addCard(): void {

    if (this.isCreateCardProcess) {
      return;
    }

    this.isCreateCardProcess = true;

    // передаем имя карточки в сервис и возвращается обьект карточки
    this.cardService.createCard(this.column._id, {name: this.cardName}).subscribe((response: Card) => {
      setTimeout(() => {
        this.column.cards.unshift(response);
        // очищаем поле ввода
        this.cardName = '';

        this.isCreateCardProcess = false;
      }, 1500);
    });
  }

  // передача сигнала удаления в родительский компонент(контейнер)
  public removeColumn(): void {
    this.columnDeleted.emit(this.column._id);
  }

  // удаление карточки, при передачи сигнала с карточки
  public onCardDeleted(cardId: string): void {

    if (this.isDeleteCardProcess) {
      return;
    }

    this.isDeleteCardProcess = true;

    this.cardService.deleteCard(cardId).subscribe((response) => {
      const index = this.column.cards.findIndex((item) => item._id === cardId);

      if (index > -1) {
        this.column.cards.splice(index, 1);
      }

       this.isDeleteCardProcess = false;
    });
  }

  // перетаскивание карточки
  public cardMove(event: CdkDragDrop<string[]>) {

    const previousColumnData: any = [...event.previousContainer.data];
    const currentColumnData: any = [...event.container.data];
    const card: any = [...event.item.data];

    this.cardMoved.emit({
      previousColumnId: previousColumnData._id,
      currentColumnId: currentColumnData._id,
      card,
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
