import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { httpInterceptorProviders } from './interceptors';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [httpInterceptorProviders],
})
export class CoreModule {}
