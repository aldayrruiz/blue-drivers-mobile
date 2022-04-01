import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GnssIconProvider {
  private basePath = 'icon/vehicles/';
  private icons = [
    'yellow-vehicle.png',
    'red-vehicle.png',
    'purple-vehicle.png',
    'orange-vehicle.png',
    'grey-vehicle.png',
    'green-vehicle.png',
    'blue-vehicle.png',
  ];

  /**
   *
   * @returns an array of vehicle icon paths
   */
  getIconsPaths() {
    const icons = this.icons.map((file) => this.basePath + file);
    return icons;
  }
}
