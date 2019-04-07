import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardDetailComponent } from './board-detail/board-detail.component';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardCreateComponent } from './board-create/board-create.component';

export const routes: Routes = [
  { path: '', component: BoardListComponent, data: { title: 'Список досок'} },
  { path: 'create', component: BoardCreateComponent, data: { title: 'Создать доску'}},
  { path: ':id', component: BoardDetailComponent, data: { title: 'Детали доски'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule { }
