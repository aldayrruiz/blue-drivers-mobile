/* eslint-disable max-len */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomPipesModule } from '../core/pipes/custom-pipes.module';
import { DateComponent } from './date/date.component';
import { DatetimeComponent } from './datetime/datetime.component';
import { CommonPaymentFormComponent } from './diets/forms/common-payment-form/common-payment-form.component';
import { GasolinePaymentFormComponent } from './diets/forms/gasoline-payment-form/gasoline-payment-form.component';
import { HomeButtonComponent } from './home-button/home-button.component';
import { IncidentStatusComponent } from './incident-status/incident-status.component';
import { CleaningFormComponent } from './maintenance/cleaning-form/cleaning-form.component';
import { ItvFormComponent } from './maintenance/itv-form/itv-form.component';
import { OdometerFormComponent } from './maintenance/odometer-form/odometer-form.component';
import { RepairmentFormComponent } from './maintenance/repairment-form/repairment-form.component';
import { RevisionFormComponent } from './maintenance/revision-form/revision-form.component';
import { WheelsFormComponent } from './maintenance/wheels-form/wheels-form.component';
import { MyReservationInformationComponent } from './my-reservation-information/my-reservation-information.component';
import { PhotosComponent } from './photos/photos.component';
import { ReservationCommonFormComponent } from './reservation-common-form/reservation-common-form.component';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { TicketStatusComponent } from './ticket-status/ticket-status.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { VehicleInformationComponent } from './vehicle-information/vehicle-information.component';

@NgModule({
  declarations: [
    IncidentStatusComponent,
    TicketStatusComponent,
    ShowHidePasswordComponent,
    ToolbarComponent,
    VehicleInformationComponent,
    HomeButtonComponent,
    DatetimeComponent,
    DateComponent,
    ReservationCommonFormComponent,
    MyReservationInformationComponent,
    CommonPaymentFormComponent,
    GasolinePaymentFormComponent,
    CleaningFormComponent,
    ItvFormComponent,
    OdometerFormComponent,
    RepairmentFormComponent,
    RevisionFormComponent,
    WheelsFormComponent,
    PhotosComponent,
  ],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, CustomPipesModule],
  exports: [
    IncidentStatusComponent,
    TicketStatusComponent,
    ShowHidePasswordComponent,
    ToolbarComponent,
    VehicleInformationComponent,
    HomeButtonComponent,
    DatetimeComponent,
    DateComponent,
    ReservationCommonFormComponent,
    MyReservationInformationComponent,
    CommonPaymentFormComponent,
    GasolinePaymentFormComponent,
    CleaningFormComponent,
    ItvFormComponent,
    OdometerFormComponent,
    RepairmentFormComponent,
    RevisionFormComponent,
    WheelsFormComponent,
    PhotosComponent,
  ],
})
export class SharedModule {}
