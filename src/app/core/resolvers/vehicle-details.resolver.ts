import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Reservation, VehicleDetails } from '../models';
import {
  LoadingService,
  ReservationService,
  VehicleService,
} from '../services';

interface ResolvedData {
  vehicle: VehicleDetails;
  reservations: Reservation[];
}

@Injectable({
  providedIn: 'root',
})
export class VehicleDetailsResolver implements Resolve<ResolvedData> {
  constructor(
    private reservationSrv: ReservationService,
    private vehicleSrv: VehicleService,
    private loadingSrv: LoadingService
  ) {}

  async resolve(route: ActivatedRouteSnapshot) {
    await this.loadingSrv.present();
    const vehicleId = route.params.vehicleId;

    const options = {
      params: new HttpParams().set('vehicleId', vehicleId),
    };

    const fetchReservations = this.reservationSrv
      .getAll(options)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();

    const fetchVehicleInfo = this.vehicleSrv
      .get(vehicleId, true)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();

    const [reservations, vehicle] = await Promise.all([
      fetchReservations,
      fetchVehicleInfo,
    ]);

    return { reservations, vehicle };
  }
}
