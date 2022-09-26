import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DietResolver, ReservationDetailsResolver } from 'src/app/core/resolvers';
import { MyDietsPage } from './my-diets.page';

const routes: Routes = [
  {
    path: '',
    component: MyDietsPage,
    resolve: { reservation: ReservationDetailsResolver, diet: DietResolver },
  },
  {
    path: 'add-diet',
    loadChildren: () =>
      import('src/app/pages/diets/add-diet/add-diet.module').then((m) => m.AddDietPageModule),
  },
  {
    path: 'add-payment',
    loadChildren: () =>
      import('src/app/pages/diets/add-payment/add-payment.module').then(
        (m) => m.AddPaymentPageModule
      ),
  },
  {
    path: 'edit-payment/:dietId',
    loadChildren: () =>
      import('src/app/pages/diets/edit-payment/edit-payment.module').then(
        (m) => m.EditPaymentPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyDietsPageRoutingModule {}
