import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationDetailsResolver } from 'src/app/core/resolvers';
import { AddPaymentPage } from './add-payment.page';

const routes: Routes = [
  {
    path: '',
    component: AddPaymentPage,
    resolve: {
      reservation: ReservationDetailsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPaymentPageRoutingModule {}
