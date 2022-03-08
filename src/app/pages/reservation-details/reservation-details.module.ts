import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { ReservationDetailsPageRoutingModule } from './reservation-details-routing.module';
import { ReservationDetailsPage } from './reservation-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReservationDetailsPageRoutingModule,
  ],
  declarations: [ReservationDetailsPage],
})
export class ReservationDetailsPageModule {}
