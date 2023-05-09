import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { ControlDoorsPageRoutingModule } from './control-doors-routing.module';
import { ControlDoorsPage } from './control-doors.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ControlDoorsPageRoutingModule],
  declarations: [ControlDoorsPage],
})
export class ControlDoorsPageModule {}
