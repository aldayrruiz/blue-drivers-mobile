import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OnlyDatePipe } from './date.pipe';
import { DistanceFromNow } from './distance-from-now.pipe';
import { DurationPipe } from './duration.pipe';
import { EssentialDatePipe } from './essential-date.pipe';
import { NotTooLongPipe } from './not-too-long.pipe';
import { OnlyTimePipe } from './only-time.pipe';
import { FromKnotsToKphPipe } from './to-kph.pipe';

@NgModule({
  declarations: [
    DurationPipe,
    DistanceFromNow,
    NotTooLongPipe,
    FromKnotsToKphPipe,
    EssentialDatePipe,
    OnlyTimePipe,
    OnlyDatePipe,
  ],
  imports: [CommonModule],
  exports: [
    DurationPipe,
    DistanceFromNow,
    NotTooLongPipe,
    FromKnotsToKphPipe,
    EssentialDatePipe,
    OnlyTimePipe,
    OnlyDatePipe,
  ],
})
export class CustomPipesModule {}
