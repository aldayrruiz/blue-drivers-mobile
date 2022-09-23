import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { CustomPipesModule } from 'src/app/core/pipes/custom-pipes.module';
import { MyDietsPageRoutingModule } from './my-diets-routing.module';
import { MyDietsPage } from './my-diets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CustomPipesModule,
    MyDietsPageRoutingModule,
  ],
  declarations: [MyDietsPage],
})
export class MyDietsPageModule {}
