import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { SharedModule } from 'src/app/components/shared-module.module';
import { CustomPipesModule } from 'src/app/core/pipes/custom-pipes.module';
import { CalModalPageModule } from '../../cal-modal/cal-modal.module';
import { ReserveByVehiclePageRoutingModule } from './vehicle-details-routing.module';
import { ReserveByVehiclePage } from './vehicle-details.page';
registerLocaleData(localeEs);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CustomPipesModule,
    ReserveByVehiclePageRoutingModule,
    NgCalendarModule,
    CalModalPageModule,
  ],
  declarations: [ReserveByVehiclePage],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class ReserveByVehiclePageModule {}
