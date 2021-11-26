import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Vehicle } from 'src/app/core/models';
import { LoadingService } from 'src/app/core/services/loading.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';

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
