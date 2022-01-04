import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared-module.module';
import { AccountPageRoutingModule } from './account-routing.module';
import { AccountPage } from './account.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: AccountPage }]),
    AccountPageRoutingModule,
  ],
  declarations: [AccountPage],
})
export class AccountPageModule {}
