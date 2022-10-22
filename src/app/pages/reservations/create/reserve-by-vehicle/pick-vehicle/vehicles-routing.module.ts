import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesResolver } from 'src/app/core/resolvers';
import { VehiclesPage } from './vehicles.page';

const routes: Routes = [
  {
    path: '',
    component: VehiclesPage,
    resolve: {
      vehicles: VehiclesResolver,
    },
  },
  {
    path: ':vehicleId',
    loadChildren: () =>
      import('../pick-date/vehicle-details.module').then((m) => m.ReserveByVehiclePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclesPageRoutingModule {}
