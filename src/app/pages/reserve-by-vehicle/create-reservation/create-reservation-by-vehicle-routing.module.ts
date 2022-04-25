import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationTemplatesResolver, VehicleSimpleResolver } from 'src/app/core/resolvers';
import { CreateReservationByVehiclePage } from './create-reservation-by-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: CreateReservationByVehiclePage,
    resolve: {
      vehicle: VehicleSimpleResolver,
      reservationTemplates: ReservationTemplatesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateReservationByVehiclePageRoutingModule {}
