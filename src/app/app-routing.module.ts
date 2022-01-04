import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, AutoLoginGuard } from './core/guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'members',
    loadChildren: () =>
      import('./pages/menu/menu.module').then((m) => m.MenuPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canLoad: [AutoLoginGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'recover-password',
    loadChildren: () =>
      import('./pages/recover-password/recover-password.module').then(
        (m) => m.RecoverPasswordPageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
