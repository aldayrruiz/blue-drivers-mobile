import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = 'assets/';
  }

  /**
   * Return Correct Url for assets in dev and prod env.
   *
   * @param target Relative path under assets directory. For example, 'img/full-moon-png'
   * @returns
   */
  getUrl(target: string): string {
    return `${this.baseUrl}${target}`;
  }
}
