import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { AddOperationPageRoutingModule } from './add-operation-routing.module';
import { AddOperationPage } from './add-operation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    AddOperationPageRoutingModule,
  ],
  declarations: [AddOperationPage],
})
export class AddOperationPageModule {}
