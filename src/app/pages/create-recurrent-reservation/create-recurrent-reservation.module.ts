import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { CalModalPageModule } from '../cal-modal/cal-modal.module';
import { CreateRecurrentReservationPageRoutingModule } from './create-recurrent-reservation-routing.module';
import { CreateRecurrentReservationPage } from './create-recurrent-reservation.page';

registerLocaleData(localeEs);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRecurrentReservationPageRoutingModule,
    NgCalendarModule,
    CalModalPageModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateRecurrentReservationPage],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class CreateRecurrentReservationPageModule {}
