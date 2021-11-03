import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Reservation } from 'src/app/core/models';
import { ReservationService } from 'src/app/core/services';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationDetailsResolver implements Resolve<Reservation> {
  constructor(
    private service: ReservationService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Reservation> {
    await this.loadingSrv.present();
    const reservationId = route.params.reservationId;
    return this.service
      .get(reservationId)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
