import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationDetailsResolver } from 'src/app/core/resolvers';
import { AddDietPage } from './add-diet.page';

const routes: Routes = [
  {
    path: '',
    component: AddDietPage,
    resolve: {
      reservation: ReservationDetailsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDietPageRoutingModule {}
