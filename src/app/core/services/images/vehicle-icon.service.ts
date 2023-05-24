import { Injectable } from '@angular/core';
import { DEFAULT_VEHICLE_ICON } from '@core/constants/vehicles';
import { AssetsService, ImageService } from '@core/services';

@Injectable({
  providedIn: 'root',
})
export class VehicleIconProvider {
  constructor(private assetsService: AssetsService, private imageService: ImageService) {}

  getFullUrlOrDefaultFromVehicle(path: string): string {
    if (Number.isInteger(path) || !path) {
      return this.assetsService.getUrl(DEFAULT_VEHICLE_ICON);
    }
    return this.imageService.getFullUrl(path);
  }
}
