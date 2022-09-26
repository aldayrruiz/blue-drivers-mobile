import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { AddPaymentPageRoutingModule } from './add-payment-routing.module';
import { AddPaymentPage } from './add-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    AddPaymentPageRoutingModule,
  ],
  declarations: [AddPaymentPage],
})
export class AddPaymentPageModule {}
