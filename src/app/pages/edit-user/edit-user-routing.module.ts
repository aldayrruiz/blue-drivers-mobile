import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserResolver } from '../../core/resolvers/user.resolver';
import { EditUserPage } from './edit-user.page';

const routes: Routes = [
  {
    path: '',
    component: EditUserPage,
    resolve: { user: UserResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditUserPageRoutingModule {}
