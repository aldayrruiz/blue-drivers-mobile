import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DietResolver } from 'src/app/core/resolvers';
import { AddDietPage } from './add-diet.page';

const routes: Routes = [
  {
    path: '',
    component: AddDietPage,
    resolve: {
      diet: DietResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDietPageRoutingModule {}
