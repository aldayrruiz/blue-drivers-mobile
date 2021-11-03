import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared-module.module';
import { MyIncidentsPageRoutingModule } from './my-incidents-routing.module';
import { MyIncidentsPage } from './my-incidents.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyIncidentsPageRoutingModule,
    SharedModule,
  ],
  declarations: [MyIncidentsPage],
})
export class MyIncidentsPageModule {}
