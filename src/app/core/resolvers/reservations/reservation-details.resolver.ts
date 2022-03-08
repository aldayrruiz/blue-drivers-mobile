import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Reservation } from '../../models';
import { LoadingService, ReservationService } from '../../services';

@Injectable({ providedIn: 'root' })
export class ReservationDetailsResolver implements Resolve<Reservation> {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly loadingSrv: LoadingService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Reservation> {
    await this.loadingSrv.present();
    const reservationId = route.params.reservationId;
    return this.reservationService
      .get(reservationId)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
