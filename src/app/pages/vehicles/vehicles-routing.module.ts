import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesResolver } from '../../core/resolvers/vehicles/vehicles.resolver';
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
      import('../vehicle-details/vehicle-details.module').then(
        (m) => m.VehicleDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclesPageRoutingModule {}
