import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesResolver } from 'src/app/core/resolvers';
import { DoorsPage } from './doors.page';

const routes: Routes = [
  {
    path: '',
    component: DoorsPage,
    resolve: {
      vehicles: VehiclesResolver,
    },
  },
  {
    path: ':vehicleId',
    loadChildren: () =>
      import('./components/control-doors/control-doors.module').then(
        (m) => m.ControlDoorsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoorsPageRoutingModule {}
