import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DietGuard } from 'src/app/core/guards';
import { PositionsResolver, ReservationDetailsResolver } from 'src/app/core/resolvers';
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
      import('src/app/pages/incidents/create-incident/create-incident.module').then(
        (m) => m.CreateIncidentPageModule
      ),
  },
  {
    path: 'my-diets',
    loadChildren: () =>
      import('src/app/pages/diets/my-diets/my-diets.module').then((m) => m.MyDietsPageModule),
    canLoad: [DietGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationDetailsPageRoutingModule {}
