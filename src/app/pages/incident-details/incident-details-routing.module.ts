import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentDetailsResolver } from 'src/app/core/resolvers';
import { IncidentDetailsPage } from './incident-details.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentDetailsPage,
    resolve: { incident: IncidentDetailsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentDetailsPageRoutingModule {}
