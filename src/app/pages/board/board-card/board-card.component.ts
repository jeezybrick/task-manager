import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from '../../../models/card.model';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent implements OnInit {

  // декоратор, данные с файла html в card
  @Input() card: Card;
  // декорантор, данные с этого компонент в родительский(колонка)
  @Output() cardDeleted = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }
  // передача сигнала удаления в родительский компонент(колонку)
  public removeCard(event: Event) {
    event.stopPropagation();
    this.cardDeleted.emit(this.card._id);
  }

}
