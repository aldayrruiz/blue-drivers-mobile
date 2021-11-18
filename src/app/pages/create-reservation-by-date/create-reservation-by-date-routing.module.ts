import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesResolver } from 'src/app/core/resolvers';
import { CreateReservationByDatePage } from './create-reservation-by-date.page';

const routes: Routes = [
  {
    path: '',
    component: CreateReservationByDatePage,
    resolve: {
      vehicles: VehiclesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateReservationByDatePageRoutingModule {}
