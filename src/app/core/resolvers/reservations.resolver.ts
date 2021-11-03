import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Reservation } from 'src/app/core/models';
import { ReservationService } from 'src/app/core/services';
import { LoadingService } from 'src/app/core/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationsResolver implements Resolve<Reservation[]> {
  constructor(
    private service: ReservationService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Reservation[]> {
    await this.loadingSrv.present();

    const vehicleId = route.params.vehicleId;
    const date = new Date();
    const firstDayThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayNextMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1
    );
    const options = {
      params: new HttpParams()
        .set('vehicleId', vehicleId)
        .set('from', firstDayThisMonth.toJSON())
        .set('to', firstDayNextMonth.toJSON()),
    };
    return this.service
      .getAll(options)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
