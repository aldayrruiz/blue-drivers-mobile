import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyReservationsResolver } from 'src/app/core/resolvers';
import { MyReservationsPage } from './my-reservations.page';

const routes: Routes = [
  {
    path: '',
    component: MyReservationsPage,
    resolve: {
      myReservations: MyReservationsResolver,
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
export class MyReservationsPageRoutingModule {}
