import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { AddDietPageRoutingModule } from './add-diet-routing.module';
import { AddDietPage } from './add-diet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    AddDietPageRoutingModule,
  ],
  declarations: [AddDietPage],
})
export class AddDietPageModule {}
