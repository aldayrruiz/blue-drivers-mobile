import { Injectable } from '@angular/core';
import { Reservation } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MyDateService {
  private months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  private days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];

  constructor() {}

  public getTimeReserved(reservation: Reservation): string {
    const start = new Date(reservation.start);
    const end = new Date(reservation.end);
    const milliseconds = end.getTime() - start.getTime(); // milliseconds
    const hours = Math.floor((milliseconds % 86400000) / 3600000); // hours
    const minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000); // minutes
    return `${hours}h ${minutes}m`;
  }

  public getHmEach15m(date: Date): Date {
    const minutes = date.getMinutes();
    let result = 0;

    if (minutes < 15) {
      result = 15;
    } else if (minutes < 30) {
      result = 30;
    } else if (minutes < 45) {
      result = 45;
    } else {
      date.setHours(date.getHours() + 1);
      result = 0;
    }

    date.setMinutes(result);
    return date;
  }

  public toDateString(date: Date) {
    return `${this.days[date.getDay()]} ${
      this.months[date.getMonth()]
    } ${date.getUTCDate()} ${date.getFullYear()}`;
  }
}
