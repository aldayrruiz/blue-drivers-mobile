import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleDetailsResolver } from 'src/app/core/resolvers';
import { ReserveByVehiclePage } from './vehicle-details.page';

const routes: Routes = [
  {
    path: '',
    component: ReserveByVehiclePage,
    resolve: {
      vehicleDetails: VehicleDetailsResolver,
    },
  },
  {
    path: 'create-reservation',
    loadChildren: () =>
      import(
        'src/app/pages/reservations/create/reserve-by-vehicle/create-reservation/create-reservation-by-vehicle.module'
      ).then((m) => m.CreateReservationByVehiclePageModule),
  },
  {
    path: 'create-ticket/:reservationId',
    loadChildren: () =>
      import('src/app/pages/tickets/create-ticket/create-ticket.module').then(
        (m) => m.CreateTicketPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReserveByVehiclePageRoutingModule {}
