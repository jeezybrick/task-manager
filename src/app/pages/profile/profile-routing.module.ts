import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

export const routes: Routes = [
  {path: '', redirectTo: 'edit', pathMatch: 'full'},
  { path: 'edit', component: EditProfileComponent, data: { title: 'Редактировать профиль'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
