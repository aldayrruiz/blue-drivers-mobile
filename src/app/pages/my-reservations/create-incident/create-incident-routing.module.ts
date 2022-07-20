import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateIncidentPage } from './create-incident.page';

const routes: Routes = [
  {
    path: '',
    component: CreateIncidentPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateIncidentPageRoutingModule {}
