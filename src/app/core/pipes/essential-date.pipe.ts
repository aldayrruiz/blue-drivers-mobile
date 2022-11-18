import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'essential' })
export class EssentialDatePipe implements PipeTransform {
  transform(date?: Date | string, format: string = 'EEE, d MMM yyyy, HH:mm'): string {
    if (date === null) {
      return '';
    }
    date = new Date(date);
    return new DatePipe('es-ES').transform(date, format);
  }
}
