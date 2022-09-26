import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from '..';
import {
  CreateDiet,
  CreateDietPhoto,
  CreatePayment,
  PatchDiet,
  PatchPayment,
  Payment,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DietService {
  constructor(private http: HttpClient, private urlSrv: ServerUrlService) {}

  createDiet(diet: CreateDiet): Observable<CreateDiet> {
    const baseUrl = this.urlSrv.getDiets();
    const path = `${baseUrl}/`;
    return this.http.post<CreateDiet>(path, diet);
  }

  getDiet(reservationId: string): Observable<CreateDiet> {
    const baseUrl = this.urlSrv.getDiets();
    const options = { params: new HttpParams().set('reservationId', reservationId) };
    const path = `${baseUrl}/get_diet_by_reservation/`;
    return this.http.get<CreateDiet>(path, options);
  }

  patchDiet(id: string, diet: PatchDiet): Observable<CreateDiet> {
    const baseUrl = this.urlSrv.getDiets();
    const path = `${baseUrl}/${id}/`;
    return this.http.patch<CreateDiet>(path, diet);
  }

  createPayment(payment: CreatePayment) {
    const baseUrl = this.urlSrv.getDietPayments();
    const path = `${baseUrl}/`;
    return this.http.post<Payment>(path, payment);
  }

  getPayment(id: string) {
    const baseUrl = this.urlSrv.getDietPayments();
    const path = `${baseUrl}/${id}/`;
    return this.http.get<Payment>(path);
  }

  patchPayment(id: string, payment: PatchPayment) {
    const baseUrl = this.urlSrv.getDietPayments();
    const path = `${baseUrl}/${id}/`;
    return this.http.patch<Payment>(path, payment);
  }

  deletePayment(id: string) {
    const baseUrl = this.urlSrv.getDietPayments();
    const path = `${baseUrl}/${id}/`;
    return this.http.delete<void>(path);
  }

  addPhotoToPayment(photo: CreateDietPhoto) {
    const baseUrl = this.urlSrv.getDietPhotos();
    const path = `${baseUrl}/`;
    return this.http.post<CreateDietPhoto>(path, photo);
  }

  deletePhoto(id: string) {
    const baseUrl = this.urlSrv.getDietPhotos();
    const path = `${baseUrl}/${id}/`;
    return this.http.delete<void>(path);
  }
}
