import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPage } from './account.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPage,
  },
  {
    path: 'edit-user',
    loadChildren: () => import('../edit-user/edit-user.module').then((m) => m.EditUserPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
