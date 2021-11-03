import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared-module.module';
import { IncidentDetailsPageRoutingModule } from './incident-details-routing.module';
import { IncidentDetailsPage } from './incident-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentDetailsPageRoutingModule,
    SharedModule,
  ],
  declarations: [IncidentDetailsPage],
})
export class IncidentDetailsPageModule {}
