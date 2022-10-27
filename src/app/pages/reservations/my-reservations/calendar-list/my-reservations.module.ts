import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { SharedModule } from 'src/app/components/shared-module.module';
import { CustomPipesModule } from 'src/app/core/pipes/custom-pipes.module';
import { MyReservationsPageRoutingModule } from './my-reservations-routing.module';
import { MyReservationsPage } from './my-reservations.page';
registerLocaleData(localeEs);

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    CustomPipesModule,
    MyReservationsPageRoutingModule,
    NgCalendarModule,
  ],
  declarations: [MyReservationsPage],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class MyReservationsPageModule {}
