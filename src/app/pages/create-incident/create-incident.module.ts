import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../components/shared-module.module';
import { CreateIncidentPageRoutingModule } from './create-incident-routing.module';
import { CreateIncidentPage } from './create-incident.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CreateIncidentPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateIncidentPage],
})
export class CreateIncidentPageModule {}
