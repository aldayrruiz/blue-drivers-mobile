import { Injectable } from '@angular/core';
import { Reservation } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MyReservationsTabStorage {
  currentReservation: Reservation;

  constructor() {}

  public setCurrentReservation(data: Reservation): void {
    this.currentReservation = data;
  }

  public getCurrentReservation(): Reservation {
    return this.currentReservation;
  }
}
