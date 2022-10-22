import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllReservationsPage } from './all-reservations.page';

const routes: Routes = [
  {
    path: '',
    component: AllReservationsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllReservationsPageRoutingModule {}
