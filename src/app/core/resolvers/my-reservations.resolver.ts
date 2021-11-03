import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Reservation } from 'src/app/core/models';
import { ReservationService } from 'src/app/core/services';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class MyReservationsResolver implements Resolve<Reservation[]> {
  constructor(
    private service: ReservationService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(): Promise<Reservation[]> {
    await this.loadingSrv.present();
    const options = { params: new HttpParams() };
    return this.service
      .getAll(options)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
  }
}
