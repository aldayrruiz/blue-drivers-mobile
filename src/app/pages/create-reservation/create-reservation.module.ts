import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { SharedModule } from 'src/app/components/shared-module.module';
import { CalModalPageModule } from '../cal-modal/cal-modal.module';
import { CreateReservationPageRoutingModule } from './create-reservation-routing.module';
import { CreateReservationPage } from './create-reservation.page';

registerLocaleData(localeEs);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CreateReservationPageRoutingModule,
    NgCalendarModule,
    CalModalPageModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateReservationPage],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class CreateReservationPageModule {}
