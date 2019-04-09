import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth-guard.service';
import { AlreadyAuthGuard } from './guards/auth/already-auth.guard';

// роутинг
const routes: Routes = [
  {path: '', redirectTo: 'boards', pathMatch: 'full'},
  {
    path: 'boards',
    loadChildren: 'app/pages/board/board.module#BoardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: 'app/pages/profile/profile.module#ProfileModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: 'app/pages/auth/auth.module#AuthModule',
    canActivate: [AlreadyAuthGuard]
  },
  {
    path: 'admin',
    loadChildren: 'app/pages/admin/admin.module#AdminModule',
    canActivate: [AuthGuard]
  }];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AlreadyAuthGuard],
  declarations: []
})

export class AppRoutingModule {}
