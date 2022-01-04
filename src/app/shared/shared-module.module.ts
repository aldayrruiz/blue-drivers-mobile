import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IncidentTypeComponent } from './components/incident-type/incident-type.component';
import { ShowHidePasswordComponent } from './components/show-hide-password/show-hide-password.component';
import { TicketStatusComponent } from './components/ticket-status/ticket-status.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  declarations: [
    IncidentTypeComponent,
    TicketStatusComponent,
    ShowHidePasswordComponent,
    ToolbarComponent,
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    IncidentTypeComponent,
    TicketStatusComponent,
    ShowHidePasswordComponent,
    ToolbarComponent,
  ],
})
export class SharedModule {}
