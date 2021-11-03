import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared-module.module';
import { TicketDetailsPageRoutingModule } from './ticket-details-routing.module';
import { TicketDetailsPage } from './ticket-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketDetailsPageRoutingModule,
    SharedModule,
  ],
  declarations: [TicketDetailsPage],
})
export class TicketDetailsPageModule {}
