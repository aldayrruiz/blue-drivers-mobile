import { Injectable } from '@angular/core';
import { VehicleDetails } from '../models';

@Injectable({
  providedIn: 'root',
})
export class VehiclesTabStorage {
  private currentVehicle: VehicleDetails;
  private selectedDate: Date;
  constructor() {}

  /**
   * Store the Vehicle.
   *
   * @param data Vehicle object.
   */
  public setCurrentVehicle(data: VehicleDetails): void {
    this.currentVehicle = data;
  }

  /**
   * Get the current Vehicle.
   *
   * @returns Get the Vehicle that was clicked.
   */
  public getCurrentVehicle(): VehicleDetails {
    return this.currentVehicle;
  }

  public setSelectedDate(date: Date): void {
    this.selectedDate = date;
  }

  public getSelectedDate(): Date {
    return this.selectedDate;
  }
}
