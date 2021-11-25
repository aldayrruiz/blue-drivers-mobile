import { Injectable } from '@angular/core';
import { Reservation } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MyReservationsTabStorage {
  private currentReservation: Reservation;
  private selectedDate: Date;

  constructor() {}

  public selectDate(date: Date): void {
    this.selectedDate = date;
  }

  public getDate(): Date {
    return this.selectedDate;
  }

  public setCurrentReservation(data: Reservation): void {
    this.currentReservation = data;
  }

  public getCurrentReservation(): Reservation {
    return this.currentReservation;
  }
}
