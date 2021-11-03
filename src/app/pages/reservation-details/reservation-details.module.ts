import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReservationDetailsPageRoutingModule } from './reservation-details-routing.module';
import { ReservationDetailsPage } from './reservation-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationDetailsPageRoutingModule,
  ],
  declarations: [ReservationDetailsPage],
})
export class ReservationDetailsPageModule {}
