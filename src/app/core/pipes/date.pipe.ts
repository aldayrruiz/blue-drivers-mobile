import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'onlyDate' })
export class OnlyDatePipe implements PipeTransform {
  transform(date: Date | string, day: number, format: string = 'd MMM yyyy'): string {
    if (date === null) {
      return '';
    }
    date = new Date(date);
    return new DatePipe('es-ES').transform(date, format);
  }
}
