import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { PickVehiclePageRoutingModule } from './pick-vehicle-routing.module';
import { PickVehiclePage } from './pick-vehicle.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, PickVehiclePageRoutingModule],
  declarations: [PickVehiclePage],
})
export class PickVehiclePageModule {}
