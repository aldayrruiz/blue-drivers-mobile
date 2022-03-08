import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { CustomPipesModule } from 'src/app/core/pipes/custom-pipes.module';
import { GnssPageRoutingModule } from './gnss-routing.module';
import { GnssPage } from './gnss.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GnssPageRoutingModule,
    SharedModule,
    CustomPipesModule,
  ],
  declarations: [GnssPage],
})
export class GnssPageModule {}
