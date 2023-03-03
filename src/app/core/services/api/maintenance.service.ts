import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from '..';
import {
  CreateCleaning,
  CreateItv,
  CreateOdometer,
  CreateRepairment,
  CreateRevision,
  ItvPhoto,
  OdometerPhoto,
  RepairmentPhoto,
  RevisionPhoto,
  WheelsPhoto,
} from '../../models';
import { CleaningPhoto } from '../../models/maintenance/cleaning/photo.model';
import { CreateWheels } from '../../models/maintenance/wheels/create.model';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  constructor(private http: HttpClient, private urlSrv: ServerUrlService) {}

  createCleaning(cleaning: CreateCleaning): Observable<CreateCleaning> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/cleanings/`;
    return this.http.post<CreateCleaning>(path, cleaning);
  }

  createItv(itv: CreateItv): Observable<CreateItv> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/itvs/`;
    return this.http.post<CreateItv>(path, itv);
  }

  createRepairment(repairment: CreateRepairment): Observable<CreateRepairment> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/repairments/`;
    return this.http.post<CreateRepairment>(path, repairment);
  }

  createRevision(revision: CreateRevision): Observable<CreateRevision> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/revisions/`;
    return this.http.post<CreateRevision>(path, revision);
  }

  createOdometer(odometer: CreateOdometer): Observable<CreateOdometer> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/odometers/`;
    return this.http.post<CreateOdometer>(path, odometer);
  }

  createWheels(wheels: CreateWheels): Observable<CreateWheels> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/wheels/`;
    return this.http.post<CreateWheels>(path, wheels);
  }

  addPhotosToCleaning(photo: CleaningPhoto): Observable<CleaningPhoto> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/cleaning-photos/`;
    return this.http.post<CleaningPhoto>(path, photo);
  }

  addPhotosToItv(photo: ItvPhoto): Observable<ItvPhoto> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/itv-photos/`;
    return this.http.post<ItvPhoto>(path, photo);
  }

  addPhotosToRepairment(photo: RepairmentPhoto): Observable<RepairmentPhoto> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/repairment-photos/`;
    return this.http.post<RepairmentPhoto>(path, photo);
  }

  addPhotosToRevision(photo: RevisionPhoto): Observable<RevisionPhoto> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/revision-photos/`;
    return this.http.post<RevisionPhoto>(path, photo);
  }

  addPhotosToOdometer(photo: OdometerPhoto): Observable<OdometerPhoto> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/odometer-photos/`;
    return this.http.post<OdometerPhoto>(path, photo);
  }

  addPhotosToWheels(photo: WheelsPhoto): Observable<WheelsPhoto> {
    const url = this.urlSrv.getMaintenance();
    const path = `${url}/wheels-photos/`;
    return this.http.post<WheelsPhoto>(path, photo);
  }
}
