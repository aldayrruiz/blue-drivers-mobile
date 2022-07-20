import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toKph' })
export class FromKnotsToKphPipe implements PipeTransform {
  /**
   * from knots to Kph
   *
   * @param knots
   * @param args
   * @returns
   */
  transform(knots: number, ...args: unknown[]): number {
    return knots * 1.85;
  }
}
