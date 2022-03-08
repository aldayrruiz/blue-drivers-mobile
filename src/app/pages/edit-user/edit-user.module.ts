import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/shared-module.module';
import { EditUserPageRoutingModule } from './edit-user-routing.module';
import { EditUserPage } from './edit-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    EditUserPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditUserPage],
})
export class EditUserPageModule {}
