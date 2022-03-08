import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notTooLong',
})
export class NotTooLongPipe implements PipeTransform {
  /**
   * Value in milliseconds
   *
   * @param value
   * @param args
   * @returns
   */
  transform(value: string, ...args: unknown[]): string {
    const limit = Number(args[0]);
    const firstPartText = value.substring(0, limit);
    const isTooLong = value.length > limit;
    return isTooLong ? `${firstPartText}...` : firstPartText;
  }
}
