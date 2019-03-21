import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardContainerComponent } from './board-container/board-container.component';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardCreateComponent } from './board-create/board-create.component';

export const routes: Routes = [
  { path: '', component: BoardListComponent, data: { title: 'Список досок'} },
  { path: 'create', component: BoardCreateComponent, data: { title: 'Создать доску'}},
  { path: ':id', component: BoardContainerComponent, data: { title: 'Детали доски'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule { }
