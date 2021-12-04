import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Vehicle } from 'src/app/core/models';
import { LoadingService, VehicleService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class VehiclesResolver implements Resolve<Vehicle[]> {
  constructor(
    private service: VehicleService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(): Promise<Vehicle[]> {
    await this.loadingSrv.present();
    return this.service
      .getAll()
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
