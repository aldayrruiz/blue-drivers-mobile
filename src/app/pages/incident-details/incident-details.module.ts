import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { CustomPipesModule } from 'src/app/core/pipes/custom-pipes.module';
import { IncidentDetailsPageRoutingModule } from './incident-details-routing.module';
import { IncidentDetailsPage } from './incident-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomPipesModule,
    IncidentDetailsPageRoutingModule,
    SharedModule,
  ],
  declarations: [IncidentDetailsPage],
})
export class IncidentDetailsPageModule {}
