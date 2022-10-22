import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { RecoverPasswordPageRoutingModule } from './recover-password-routing.module';
import { RecoverPasswordPage } from './recover-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecoverPasswordPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [RecoverPasswordPage],
})
export class RecoverPasswordPageModule {}
