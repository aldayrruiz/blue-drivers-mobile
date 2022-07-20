import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationTemplatesResolver, VehiclesResolver } from 'src/app/core/resolvers';
import { ReserveByDatePage } from './reserve-by-date.page';

const routes: Routes = [
  {
    path: '',
    component: ReserveByDatePage,
    resolve: {
      vehicles: VehiclesResolver,
      reservationTemplates: ReservationTemplatesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReserveByDatePageRoutingModule {}
