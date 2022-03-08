import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { VehicleDetails } from '../../models';
import { LoadingService, VehicleService } from '../../services';

interface ResolvedData {
  vehicle: VehicleDetails;
}

@Injectable({
  providedIn: 'root',
})
export class VehicleDetailsResolver implements Resolve<ResolvedData> {
  constructor(
    private readonly vehicleSrv: VehicleService,
    private readonly loadingSrv: LoadingService
  ) {}

  async resolve(route: ActivatedRouteSnapshot) {
    await this.loadingSrv.present();
    const vehicleId = route.params.vehicleId;

    const fetchVehicleInfo = this.vehicleSrv
      .get(vehicleId, true)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();

    const [vehicle] = await Promise.all([fetchVehicleInfo]);

    return { vehicle };
  }
}
