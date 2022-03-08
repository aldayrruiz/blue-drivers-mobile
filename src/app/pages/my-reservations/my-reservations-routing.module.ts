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
    path: 'create-by-date',
    loadChildren: () =>
      import('../create-reservation-by-date/create-reservation-by-date.module').then(
        (m) => m.CreateReservationByDatePageModule
      ),
  },
  {
    path: ':reservationId',
    loadChildren: () =>
      import('../reservation-details/reservation-details.module').then(
        (m) => m.ReservationDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyReservationsPageRoutingModule {}
