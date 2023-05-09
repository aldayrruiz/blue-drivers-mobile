import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { DoorsPageRoutingModule } from './doors-routing.module';
import { DoorsPage } from './doors.page';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SharedModule, DoorsPageRoutingModule],
  declarations: [DoorsPage],
})
export class DoorsPageModule {}
