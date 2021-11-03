import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesResolver } from 'src/app/core/resolvers';
import { CreateRecurrentReservationPage } from './create-recurrent-reservation.page';

const routes: Routes = [
  {
    path: '',
    component: CreateRecurrentReservationPage,
    resolve: {
      vehicles: VehiclesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateRecurrentReservationPageRoutingModule {}
