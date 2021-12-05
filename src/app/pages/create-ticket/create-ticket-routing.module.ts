import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleSimpleResolver } from 'src/app/core/resolvers';
import { CreateTicketPage } from './create-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTicketPage,
    resolve: {
      vehicle: VehicleSimpleResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTicketPageRoutingModule {}
