import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { CalModalPageRoutingModule } from './cal-modal-routing.module';
import { CalModalPage } from './cal-modal.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CalModalPageRoutingModule, NgCalendarModule],
  declarations: [CalModalPage],
})
export class CalModalPageModule {}
