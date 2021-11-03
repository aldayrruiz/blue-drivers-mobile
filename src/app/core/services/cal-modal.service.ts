import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalModalService {
  /**
   * This service is used to pick a custom date instead of the today date
   * when a calendar modal is opened.
   * Due to the reason you can't pass arguments to a modal, you can use this
   * service to set the date on the method to open the modal. Then, when the
   * modal is opened, just get the date. And select it.
   */
  date: Date;

  constructor() {}

  getDate(): Date {
    return this.date;
  }
  setDate(date: Date): void {
    this.date = date;
  }
}
