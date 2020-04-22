import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth-guard.service';
import { AlreadyAuthGuard } from './guards/auth/already-auth.guard';

// роутинг
const routes: Routes = [
  {path: '', redirectTo: 'boards', pathMatch: 'full'},
  {
    path: 'boards',
    loadChildren: () => import('app/pages/board/board.module').then(m => m.BoardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('app/pages/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('app/pages/auth/auth.module').then(m => m.AuthModule),
    canActivate: [AlreadyAuthGuard]
  }];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AlreadyAuthGuard],
  declarations: []
})

export class AppRoutingModule {}
