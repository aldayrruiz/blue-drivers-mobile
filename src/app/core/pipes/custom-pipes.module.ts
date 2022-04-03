import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DurationPipe } from './duration.pipe';
import { MediumDatePipe } from './essential-date.pipe';
import { NotTooLongPipe } from './not-too-long.pipe';
import { FromKnotsToKphPipe } from './to-kph.pipe';

@NgModule({
  declarations: [DurationPipe, MediumDatePipe, NotTooLongPipe, FromKnotsToKphPipe],
  imports: [CommonModule],
  exports: [DurationPipe, MediumDatePipe, NotTooLongPipe, FromKnotsToKphPipe],
})
export class CustomPipesModule {}
