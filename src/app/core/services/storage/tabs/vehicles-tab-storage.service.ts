import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VehiclesTabStorage {
  private selectedDate: Date;
  constructor() {}

  public setSelectedDate(date: Date): void {
    this.selectedDate = date;
  }

  public getSelectedDate(): Date {
    return this.selectedDate;
  }
}
