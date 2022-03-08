import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DurationPipe } from './duration.pipe';
import { MediumDatePipe } from './essential-date.pipe';
import { NotTooLongPipe } from './not-too-long.pipe';

@NgModule({
  declarations: [DurationPipe, MediumDatePipe, NotTooLongPipe],
  imports: [CommonModule],
  exports: [DurationPipe, MediumDatePipe, NotTooLongPipe],
})
export class CustomPipesModule {}
