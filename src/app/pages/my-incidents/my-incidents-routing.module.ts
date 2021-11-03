import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyIncidentsResolver } from '../../core/resolvers/my-incidents.resolver';
import { MyIncidentsPage } from './my-incidents.page';

const routes: Routes = [
  {
    path: '',
    component: MyIncidentsPage,
    resolve: { myIncidents: MyIncidentsResolver },
  },
  {
    path: ':incidentId',
    loadChildren: () =>
      import('../incident-details/incident-details.module').then(
        (m) => m.IncidentDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyIncidentsPageRoutingModule {}
