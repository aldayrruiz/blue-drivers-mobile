import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNowStrict } from 'date-fns';
import es from 'date-fns/locale/es';

@Pipe({ name: 'distance' })
export class DistanceFromNow implements PipeTransform {
  transform(date: Date | string, day: number, format: string = 'MMMM d, y, HH:mm'): string {
    const d = new Date(date);
    return formatDistanceToNowStrict(d, { addSuffix: true, locale: es });
  }
}
