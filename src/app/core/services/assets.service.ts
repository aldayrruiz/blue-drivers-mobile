import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = environment.production ? 'static/ang/assets/' : 'assets/';
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
