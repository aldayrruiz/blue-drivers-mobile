import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTicketsResolver } from 'src/app/core/resolvers';
import { MyTicketsPage } from './my-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: MyTicketsPage,
    resolve: { myTickets: MyTicketsResolver },
  },
  {
    path: ':ticketId',
    loadChildren: () =>
      import('../ticket-details/ticket-details.module').then((m) => m.TicketDetailsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTicketsPageRoutingModule {}
