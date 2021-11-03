import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/members/vehicles',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'vehicles',
        loadChildren: () =>
          import('../vehicles/vehicles.module').then(
            (m) => m.VehiclesPageModule
          ),
      },
      {
        path: 'my-reservations',
        loadChildren: () =>
          import('../my-reservations/my-reservations.module').then(
            (m) => m.MyReservationsPageModule
          ),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../account/account.module').then((m) => m.AccountPageModule),
      },
      {
        path: 'my-tickets',
        loadChildren: () =>
          import('../my-tickets/my-tickets.module').then(
            (m) => m.MyTicketsPageModule
          ),
      },
      {
        path: 'my-incidents',
        loadChildren: () =>
          import('../my-incidents/my-incidents.module').then(
            (m) => m.MyIncidentsPageModule
          ),
      },
      {
        path: 'create-recurrent-reservation',
        loadChildren: () =>
          import(
            '../create-recurrent-reservation/create-recurrent-reservation.module'
          ).then((m) => m.CreateRecurrentReservationPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
