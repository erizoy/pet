import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToMain = () => redirectLoggedInTo(['/list']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }, {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToMain
    }
  }, {
    path: 'list',
    loadChildren: () => import('./modules/list/list.module').then(m => m.ListModule),
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  }, {
    path: 'notes',
    loadChildren: () => import('./modules/notes/notes.module').then(m => m.NotesModule),
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
