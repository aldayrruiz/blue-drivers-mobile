import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HomeButtonComponent } from './home-button/home-button.component';
import { IncidentTypeComponent } from './incident-type/incident-type.component';
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
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    IncidentTypeComponent,
    TicketStatusComponent,
    ShowHidePasswordComponent,
    ToolbarComponent,
    VehicleInformationComponent,
    HomeButtonComponent,
  ],
})
export class SharedModule {}
