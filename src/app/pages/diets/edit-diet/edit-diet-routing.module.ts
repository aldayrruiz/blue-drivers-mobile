import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DietPaymentResolver, ReservationDetailsResolver } from 'src/app/core/resolvers';
import { EditDietPage } from './edit-diet.page';

const routes: Routes = [
  {
    path: '',
    component: EditDietPage,
    resolve: {
      reservation: ReservationDetailsResolver,
      diet: DietPaymentResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDietPageRoutingModule {}
