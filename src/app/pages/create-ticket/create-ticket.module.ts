import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared-module.module';
import { CreateTicketPageRoutingModule } from './create-ticket-routing.module';
import { CreateTicketPage } from './create-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CreateTicketPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateTicketPage],
})
export class CreateTicketPageModule {}
