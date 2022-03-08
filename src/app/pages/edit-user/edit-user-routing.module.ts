import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserResolver } from 'src/app/core/resolvers';
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
