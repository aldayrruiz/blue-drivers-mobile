import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleSimpleResolver } from 'src/app/core/resolvers';
import { ControlDoorsPage } from './control-doors.page';

const routes: Routes = [
  {
    path: '',
    component: ControlDoorsPage,
    resolve: {
      vehicle: VehicleSimpleResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlDoorsPageRoutingModule {}
