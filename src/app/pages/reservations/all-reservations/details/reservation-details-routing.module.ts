import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionsResolver, ReservationDetailsResolver } from 'src/app/core/resolvers';
import { ReservationDetailsPage } from './reservation-details.page';

const routes: Routes = [
  {
    path: '',
    component: ReservationDetailsPage,
    resolve: {
      reservation: ReservationDetailsResolver,
      positions: PositionsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationDetailsPageRoutingModule {}
