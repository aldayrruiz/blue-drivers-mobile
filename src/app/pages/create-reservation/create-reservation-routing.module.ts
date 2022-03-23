import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationTemplatesResolver, VehicleSimpleResolver } from 'src/app/core/resolvers';
import { CreateReservationPage } from './create-reservation.page';

const routes: Routes = [
  {
    path: '',
    component: CreateReservationPage,
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
export class CreateReservationPageRoutingModule {}
