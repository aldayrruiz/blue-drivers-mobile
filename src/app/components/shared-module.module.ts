import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IncidentTypeComponent } from './incident-type/incident-type.component';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { TicketStatusComponent } from './ticket-status/ticket-status.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

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
