import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from '.';
import { Vehicle, VehicleDetails } from '../models';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  constructor(private http: HttpClient, private urlSrv: ServerUrlService) {}

  get(id: string, reservations: boolean): Observable<VehicleDetails> {
    const options = {
      params: new HttpParams().set('reservations', reservations),
    };
    const vehicleUrl = this.urlSrv.getVehicles();
    const path = `${vehicleUrl}/${id}/`;
    return this.http.get<VehicleDetails>(path, options);
  }

  getAll(): Observable<Vehicle[]> {
    const vehicleUrl = this.urlSrv.getVehicles();
    const path = `${vehicleUrl}/`;
    return this.http.get<Vehicle[]>(path);
  }
}
