import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DietPaymentResolver, ReservationDetailsResolver } from 'src/app/core/resolvers';
import { EditPaymentPage } from './edit-payment.page';

const routes: Routes = [
  {
    path: '',
    component: EditPaymentPage,
    resolve: {
      reservation: ReservationDetailsResolver,
      payment: DietPaymentResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPaymentPageRoutingModule {}
