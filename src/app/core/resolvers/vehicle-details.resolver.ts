import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { VehicleDetails } from '../models';
import { LoadingService, VehicleService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class VehicleDetailsResolver implements Resolve<VehicleDetails> {
  constructor(
    private service: VehicleService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<VehicleDetails> {
    await this.loadingSrv.present();
    const vehicleId = route.params.vehicleId;
    return this.service
      .get(vehicleId, true)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
