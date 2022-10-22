import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AllReservationsPageRoutingModule } from './all-reservations-routing.module';
import { AllReservationsPage } from './all-reservations.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AllReservationsPageRoutingModule],
  declarations: [AllReservationsPage],
})
export class AllReservationsPageModule {}
