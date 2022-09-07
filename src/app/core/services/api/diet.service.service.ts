import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from '..';
import {
  CreateDiet,
  CreateDietCollection,
  CreateDietPhoto,
  Diet,
  PatchDiet,
  PatchDietCollection,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DietService {
  constructor(private http: HttpClient, private urlSrv: ServerUrlService) {}

  createDietCollection(collection: CreateDietCollection): Observable<CreateDietCollection> {
    const baseUrl = this.urlSrv.getDietCollections();
    const path = `${baseUrl}/`;
    return this.http.post<CreateDietCollection>(path, collection);
  }

  getDietCollection(reservationId: string): Observable<CreateDietCollection> {
    const baseUrl = this.urlSrv.getDietCollections();
    const options = { params: new HttpParams().set('reservationId', reservationId) };
    const path = `${baseUrl}/get_collection_by_reservation/`;
    return this.http.get<CreateDietCollection>(path, options);
  }

  patchDietCollection(
    id: string,
    collection: PatchDietCollection
  ): Observable<CreateDietCollection> {
    const baseUrl = this.urlSrv.getDietCollections();
    const path = `${baseUrl}/${id}/`;
    return this.http.patch<CreateDietCollection>(path, collection);
  }

  addDietToCollection(diet: CreateDiet) {
    const baseUrl = this.urlSrv.getDiets();
    const path = `${baseUrl}/`;
    return this.http.post<Diet>(path, diet);
  }

  patchDiet(id: string, diet: PatchDiet) {
    const baseUrl = this.urlSrv.getDiets();
    const path = `${baseUrl}/${id}/`;
    return this.http.patch<Diet>(path, diet);
  }

  deleteDiet(id: string) {
    const baseUrl = this.urlSrv.getDiets();
    const path = `${baseUrl}/${id}/`;
    return this.http.delete<void>(path);
  }

  addDietPhotoToDiet(dietPhoto: CreateDietPhoto) {
    const baseUrl = this.urlSrv.getDietPhotos();
    const path = `${baseUrl}/`;
    return this.http.post<CreateDietPhoto>(path, dietPhoto);
  }

  deleteDietPhoto(id: string) {
    const baseUrl = this.urlSrv.getDietPhotos();
    const path = `${baseUrl}/${id}/`;
    return this.http.delete<void>(path);
  }

  getDiet(id: string) {
    const baseUrl = this.urlSrv.getDiets();
    const path = `${baseUrl}/${id}/`;
    return this.http.get<Diet>(path);
  }
}
