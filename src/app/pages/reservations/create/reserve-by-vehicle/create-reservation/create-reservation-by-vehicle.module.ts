import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { SharedModule } from 'src/app/components/shared-module.module';
import { CreateReservationByVehiclePageRoutingModule } from './create-reservation-by-vehicle-routing.module';
import { CreateReservationByVehiclePage } from './create-reservation-by-vehicle.page';

registerLocaleData(localeEs);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CreateReservationByVehiclePageRoutingModule,
    NgCalendarModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateReservationByVehiclePage],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class CreateReservationByVehiclePageModule {}
