/* eslint-disable max-len */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomPipesModule } from '../core/pipes/custom-pipes.module';
import { DateComponent } from './date/date.component';
import { DatetimeComponent } from './datetime/datetime.component';
import { CommonDietFormComponent } from './diets/forms/common-diet-form/common-diet-form.component';
import { GasolineDietFormComponent } from './diets/forms/gasoline-diet-form/gasoline-diet-form.component';
import { HomeButtonComponent } from './home-button/home-button.component';
import { IncidentTypeComponent } from './incident-type/incident-type.component';
import { MyReservationInformationComponent } from './my-reservation-information/my-reservation-information.component';
import { ReservationCommonFormComponent } from './reservation-common-form/reservation-common-form.component';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { TicketStatusComponent } from './ticket-status/ticket-status.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { VehicleInformationComponent } from './vehicle-information/vehicle-information.component';

@NgModule({
  declarations: [
    IncidentTypeComponent,
    TicketStatusComponent,
    ShowHidePasswordComponent,
    ToolbarComponent,
    VehicleInformationComponent,
    HomeButtonComponent,
    DatetimeComponent,
    DateComponent,
    ReservationCommonFormComponent,
    MyReservationInformationComponent,
    CommonDietFormComponent,
    GasolineDietFormComponent,
  ],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, CustomPipesModule],
  exports: [
    IncidentTypeComponent,
    TicketStatusComponent,
    ShowHidePasswordComponent,
    ToolbarComponent,
    VehicleInformationComponent,
    HomeButtonComponent,
    DatetimeComponent,
    DateComponent,
    ReservationCommonFormComponent,
    MyReservationInformationComponent,
    CommonDietFormComponent,
    GasolineDietFormComponent,
  ],
})
export class SharedModule {}
