import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DistanceFromNow } from './distance-from-now.pipe';
import { DurationPipe } from './duration.pipe';
import { NotTooLongPipe } from './not-too-long.pipe';
import { FromKnotsToKphPipe } from './to-kph.pipe';

@NgModule({
  declarations: [DurationPipe, DistanceFromNow, NotTooLongPipe, FromKnotsToKphPipe],
  imports: [CommonModule],
  exports: [DurationPipe, DistanceFromNow, NotTooLongPipe, FromKnotsToKphPipe],
})
export class CustomPipesModule {}
