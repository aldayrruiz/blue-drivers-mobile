import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyReservationsResolver } from '../../core/resolvers/my-reservations.resolver';
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
    path: 'create-recurrent',
    loadChildren: () =>
      import(
        '../create-recurrent-reservation/create-recurrent-reservation.module'
      ).then((m) => m.CreateRecurrentReservationPageModule),
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
