import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { CustomPipesModule } from 'src/app/core/pipes/custom-pipes.module';
import { MyTicketsPageRoutingModule } from './my-tickets-routing.module';
import { MyTicketsPage } from './my-tickets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyTicketsPageRoutingModule,
    SharedModule,
    CustomPipesModule,
  ],
  declarations: [MyTicketsPage],
})
export class MyTicketsPageModule {}
