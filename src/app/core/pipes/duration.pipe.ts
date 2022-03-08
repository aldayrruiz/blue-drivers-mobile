import { Pipe, PipeTransform } from '@angular/core';
import { formatDuration } from '../utils/dates/custom-fns';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  /**
   * Value in milliseconds
   *
   * @param value
   * @param args
   * @returns
   */
  transform(value: number, ...args: unknown[]): string {
    if (value === 0) {
      return '0 minutos';
    }
    const seconds = value / 1000;
    return formatDuration({ seconds });
  }
}
