import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/members/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('src/app/pages/home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'vehicles',
        loadChildren: () =>
          import(
            'src/app/pages/reservations/create/reserve-by-vehicle/pick-vehicle/vehicles.module'
          ).then((m) => m.VehiclesPageModule),
      },
      {
        path: 'my-reservations',
        loadChildren: () =>
          import(
            'src/app/pages/reservations/my-reservations/calendar-list/my-reservations.module'
          ).then((m) => m.MyReservationsPageModule),
      },
      {
        path: 'all-reservations',
        loadChildren: () =>
          import(
            'src/app/pages/reservations/all-reservations/calendar-list/all-reservations.module'
          ).then((m) => m.AllReservationsPageModule),
      },
      {
        path: 'create-by-date',
        loadChildren: () =>
          import('src/app/pages/reservations/create/reserve-by-date/reserve-by-date.module').then(
            (m) => m.ReserveByDatePageModule
          ),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('src/app/pages/profile/account/account.module').then((m) => m.AccountPageModule),
      },
      {
        path: 'my-tickets',
        loadChildren: () =>
          import('src/app/pages/tickets/my-tickets/my-tickets.module').then(
            (m) => m.MyTicketsPageModule
          ),
      },
      {
        path: 'my-incidents',
        loadChildren: () =>
          import('src/app/pages/incidents/my-incidents/my-incidents.module').then(
            (m) => m.MyIncidentsPageModule
          ),
      },
      {
        path: 'map',
        loadChildren: () => import('src/app/pages/map/map.module').then((m) => m.MapPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
