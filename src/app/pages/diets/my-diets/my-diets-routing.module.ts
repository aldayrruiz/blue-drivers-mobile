import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DietCollectionResolver, ReservationDetailsResolver } from 'src/app/core/resolvers';
import { MyDietsPage } from './my-diets.page';

const routes: Routes = [
  {
    path: '',
    component: MyDietsPage,
    resolve: { reservation: ReservationDetailsResolver, collection: DietCollectionResolver },
  },
  {
    path: 'add-diet',
    loadChildren: () =>
      import('src/app/pages/diets/add-diet/add-diet.module').then((m) => m.AddDietPageModule),
  },
  {
    path: 'edit-diet/:dietId',
    loadChildren: () =>
      import('src/app/pages/diets/edit-diet/edit-diet.module').then((m) => m.EditDietPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyDietsPageRoutingModule {}
