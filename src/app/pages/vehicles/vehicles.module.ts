import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VehiclesPageRoutingModule } from './vehicles-routing.module';
import { VehiclesPage } from './vehicles.page';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, VehiclesPageRoutingModule],
  declarations: [VehiclesPage],
})
export class VehiclesPageModule {}
