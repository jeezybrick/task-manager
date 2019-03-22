import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { HomeComponent } from '../home/home.component';

// роутинг
const routes: Routes = [
  {path: '', redirectTo: 'boards', pathMatch: 'full'},
  {
    path: 'boards',
    loadChildren: 'app/pages/board/board.module#BoardModule',
    canActivate: [AuthGuard]
  }, {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule'
  }, {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  }];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
  declarations: []
})

export class AppRoutingModule {}
