import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Reservation } from '../../models';
import { LoadingService, ReservationService } from '../../services';

@Injectable({ providedIn: 'root' })
export class AllReservationsResolver implements Resolve<Reservation[]> {
  constructor(private service: ReservationService, private loadingSrv: LoadingService) {}

  async resolve(): Promise<Reservation[]> {
    await this.loadingSrv.present();
    const options = { params: new HttpParams().set('takeAll', true) };
    return this.service
      .getAll(options)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
