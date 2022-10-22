import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { CustomPipesModule } from 'src/app/core/pipes/custom-pipes.module';
import { MyIncidentsPageRoutingModule } from './my-incidents-routing.module';
import { MyIncidentsPage } from './my-incidents.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomPipesModule,
    MyIncidentsPageRoutingModule,
    SharedModule,
  ],
  declarations: [MyIncidentsPage],
})
export class MyIncidentsPageModule {}
