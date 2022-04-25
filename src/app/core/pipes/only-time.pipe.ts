import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'onlyTime' })
export class OnlyTimePipe implements PipeTransform {
  transform(date: Date | string, day: number, format: string = 'HH:mm'): string {
    if (date === null) {
      return '';
    }
    date = new Date(date);
    return new DatePipe('es-ES').transform(date, format);
  }
}
