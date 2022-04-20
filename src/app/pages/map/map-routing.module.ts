import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionsResolver, VehiclesResolver } from 'src/app/core/resolvers';
import { MapPage } from './map.page';

const routes: Routes = [
  {
    path: '',
    component: MapPage,
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
export class MapPageRoutingModule {}
