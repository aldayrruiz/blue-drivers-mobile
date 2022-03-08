import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Vehicle } from '../../models';
import { LoadingService, VehicleService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class VehicleSimpleResolver implements Resolve<Vehicle> {
  constructor(
    private service: VehicleService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Vehicle> {
    await this.loadingSrv.present();
    const vehicleId = route.params.vehicleId;
    return this.service
      .get(vehicleId, false)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
