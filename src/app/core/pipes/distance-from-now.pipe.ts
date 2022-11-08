import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNowStrict } from 'date-fns';
import es from 'date-fns/locale/es';

@Pipe({ name: 'distance' })
export class DistanceFromNow implements PipeTransform {
  transform(date: Date | string): string {
    const d = new Date(date);
    const text = formatDistanceToNowStrict(d, { locale: es });
    const result = text
      .replace('segundos', 'seg.')
      .replace('minutos', 'min.')
      .replace('días', 'd.');
    return result;
    // return formatDistanceToNowStrict(d, { addSuffix: true, locale: es });
  }
}
