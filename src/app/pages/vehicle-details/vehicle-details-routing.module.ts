import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationsResolver } from '../../core/resolvers/reservations.resolver';
import { VehicleDetailsResolver } from '../../core/resolvers/vehicle-details.resolver';
import { VehicleDetailsPage } from './vehicle-details.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleDetailsPage,
    resolve: {
      vehicle: VehicleDetailsResolver,
      reservations: ReservationsResolver,
    },
  },
  {
    path: 'create-reservation',
    loadChildren: () =>
      import('../create-reservation/create-reservation.module').then(
        (m) => m.CreateReservationPageModule
      ),
  },
  {
    path: 'create-ticket/:reservationId',
    loadChildren: () =>
      import('../create-ticket/create-ticket.module').then(
        (m) => m.CreateTicketPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleDetailsPageRoutingModule {}
