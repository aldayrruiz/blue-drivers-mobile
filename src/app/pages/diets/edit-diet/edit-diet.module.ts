import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { EditDietPageRoutingModule } from './edit-diet-routing.module';
import { EditDietPage } from './edit-diet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    EditDietPageRoutingModule,
  ],
  declarations: [EditDietPage],
})
export class EditDietPageModule {}
