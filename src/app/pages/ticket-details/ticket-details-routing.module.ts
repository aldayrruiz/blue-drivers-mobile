import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketDetailsResolver } from '../../core/resolvers/tickets/ticket-details.resolver';
import { TicketDetailsPage } from './ticket-details.page';

const routes: Routes = [
  {
    path: '',
    component: TicketDetailsPage,
    resolve: { ticket: TicketDetailsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketDetailsPageRoutingModule {}
