import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesResolver } from 'src/app/core/resolvers';
import { PickVehiclePage } from './pick-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: PickVehiclePage,
    resolve: {
      vehicles: VehiclesResolver,
    },
  },
  {
    path: ':vehicleId',
    loadChildren: () =>
      import('../add-operation/add-operation.module').then((m) => m.AddOperationPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickVehiclePageRoutingModule {}
