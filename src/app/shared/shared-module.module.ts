import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IncidentTypeComponent } from './components/incident-type/incident-type.component';
import { ShowHidePasswordComponent } from './components/show-hide-password/show-hide-password.component';
import { TicketStatusComponent } from './components/ticket-status/ticket-status.component';

@NgModule({
  declarations: [
    IncidentTypeComponent,
    TicketStatusComponent,
    ShowHidePasswordComponent,
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    IncidentTypeComponent,
    TicketStatusComponent,
    ShowHidePasswordComponent,
  ],
})
export class SharedModule {}
