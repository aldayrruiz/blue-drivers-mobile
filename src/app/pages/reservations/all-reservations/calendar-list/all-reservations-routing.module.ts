import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllReservationsResolver } from 'src/app/core/resolvers';
import { AllReservationsPage } from './all-reservations.page';

const routes: Routes = [
  {
    path: '',
    component: AllReservationsPage,
    resolve: {
      allReservations: AllReservationsResolver,
    },
  },
  {
    path: ':reservationId',
    loadChildren: () =>
      import('../details/reservation-details.module').then((m) => m.ReservationDetailsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllReservationsPageRoutingModule {}
