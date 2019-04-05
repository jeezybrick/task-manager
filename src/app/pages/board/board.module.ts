import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BoardRoutingModule } from './board-routing.module';
import { BoardCardComponent } from './board-card/board-card.component';
import { BoardColumnComponent } from './board-column/board-column.component';
import { BoardDetailComponent } from './board-detail/board-detail.component';
import { BoardCardDialogComponent } from './board-card-dialog/board-card-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardCreateComponent } from './board-create/board-create.component';


@NgModule({
  // в declarations импорт компонентов
  declarations: [
    BoardCardComponent,
    BoardColumnComponent,
    BoardDetailComponent,
    BoardCardDialogComponent,
    BoardListComponent,
    BoardCreateComponent
  ],
  // в imports импорт модулей
  imports: [
    CommonModule,
    FormsModule,
    BoardRoutingModule,
    SharedModule
  ],
  // диалоговые окна
  entryComponents: [BoardCardDialogComponent]
})
export class BoardModule { }
