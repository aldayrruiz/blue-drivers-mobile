import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { EditPaymentPageRoutingModule } from './edit-payment-routing.module';
import { EditPaymentPage } from './edit-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    EditPaymentPageRoutingModule,
  ],
  declarations: [EditPaymentPage],
})
export class EditPaymentPageModule {}
