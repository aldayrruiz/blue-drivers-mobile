import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleSimpleResolver } from 'src/app/core/resolvers';
import { AddOperationPage } from './add-operation.page';

const routes: Routes = [
  {
    path: '',
    component: AddOperationPage,
    resolve: { vehicle: VehicleSimpleResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOperationPageRoutingModule {}
