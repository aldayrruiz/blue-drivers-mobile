import { Injectable } from '@angular/core';
import { format, utcToZonedTime } from 'date-fns-tz';

const FORMAT = `yyyy-MM-dd\'T\'HH:mm`;

/**
 * This services is only a helper for Ionic6 datepicker.
 * Datepicker needs a date string, but it does not take in count the user timezone.
 *
 * Example. If you pass `yyyy-MM-ddTHH:mmZ`. The `HH:mm` showed in the UI will be the same as the string.
 *
 * So, it is necessary to change HH:mm depending on the user timezone and show that.
 */
@Injectable({ providedIn: 'root' })
export class DateZonerHelper {
  constructor() {}

  /**
   * Given a date in UTC, it returns a formatted string like yyyy-MM-ddTHH:mm.
   *
   * HH:mm will be corresponded to user timezone.
   *
   * To rollback, you can `new Date(returnedValue)`and convert it to UTC again.
   *
   * @param date
   * @returns a string formatted.
   */
  toMyZone(date: Date) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const d = new Date(date.toJSON());
    const zonedTime = utcToZonedTime(d, userTimeZone);
    const formatted = format(zonedTime, FORMAT, { timeZone: userTimeZone });
    return formatted;
  }
}
