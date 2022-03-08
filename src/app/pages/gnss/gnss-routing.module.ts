import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionsResolver, VehiclesResolver } from 'src/app/core/resolvers';
import { GnssPage } from './gnss.page';

const routes: Routes = [
  {
    path: '',
    component: GnssPage,
    resolve: {
      vehicles: VehiclesResolver,
      positions: PositionsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GnssPageRoutingModule {}
