import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionsResolver } from 'src/app/core/resolvers/positions.resolver';
import { ReservationDetailsResolver } from '../../core/resolvers/reservation-details.resolver';
import { ReservationDetailsPage } from './reservation-details.page';

const routes: Routes = [
  {
    path: '',
    component: ReservationDetailsPage,
    resolve: {
      reservation: ReservationDetailsResolver,
      positions: PositionsResolver,
    },
  },
  {
    path: 'create-incident',
    loadChildren: () =>
      import('../create-incident/create-incident.module').then(
        (m) => m.CreateIncidentPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationDetailsPageRoutingModule {}
