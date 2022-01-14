import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { SharedModule } from 'src/app/shared/shared-module.module';
import { CalModalPageModule } from '../cal-modal/cal-modal.module';
import { MyReservationsPageRoutingModule } from './my-reservations-routing.module';
import { MyReservationsPage } from './my-reservations.page';
registerLocaleData(localeEs);

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    MyReservationsPageRoutingModule,
    NgCalendarModule,
    CalModalPageModule,
  ],
  declarations: [MyReservationsPage],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class MyReservationsPageModule {}
