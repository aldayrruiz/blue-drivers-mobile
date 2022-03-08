import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from '..';
import {
  CreateRecurrentReservation,
  CreateRecurrentResponse,
  CreateReservation,
  Recurrent,
  Reservation,
} from '../../models';
import { CreateReservationByDate } from '../../models/reservations/by-date/create-reservation-by-date.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient, private urlSrv: ServerUrlService) {}

  /**
   * Sends a GET HTTP request to the server to get a list of reservations.
   */
  getAll(options: unknown): Observable<Reservation[]> {
    const reservationUrl = this.urlSrv.getReservations();
    const path = `${reservationUrl}/`;
    return this.http.get<Reservation[]>(path, options);
  }

  /**
   * Sends a GET HTTP request to the server to get a reservation given an identifier.
   *
   * @param id identifier of the reservation to get.
   */
  get(id: string): Observable<Reservation> {
    const reservationUrl = this.urlSrv.getReservations();
    const path = `${reservationUrl}/${id}/`;
    return this.http.get<Reservation>(path);
  }

  /**
   * Send a POST HTTP request to the server to store the given reservation data.
   *
   * @param reservation data of the reservation to store.
   */
  create(reservation: CreateReservation): Observable<CreateReservation> {
    const reservationUrl = this.urlSrv.getReservations();
    const path = `${reservationUrl}/`;
    return this.http.post<CreateReservation>(path, reservation);
  }

  createRecurrent(recurrent: Recurrent) {
    const reservationUrl = this.urlSrv.getReservations();
    const path = `${reservationUrl}/create_recurrent/`;
    return this.http.post<Recurrent>(path, recurrent);
  }

  createByDate(reservation: CreateReservationByDate) {
    const reservationUrl = this.urlSrv.getReservations();
    const path = `${reservationUrl}/create_by_date/`;
    return this.http.post<Reservation>(path, reservation);
  }

  createRecurrentReservations(recReservation: CreateRecurrentReservation, force: boolean) {
    const options = { params: new HttpParams().set('force', force) };

    const reservationUrl = this.urlSrv.getReservations();
    const path = `${reservationUrl}/create_repetitive/`;
    return this.http.post<CreateRecurrentResponse>(path, recReservation, options);
  }

  /**
   * Sends a DELETE HTTP request to the server to delete the resource.
   *
   * @param id Reservation's id to delete
   */
  delete(id: string, deletePost: boolean): Observable<void> {
    const options = { params: new HttpParams().set('deletePost', deletePost) };
    const reservationUrl = this.urlSrv.getReservations();
    const path = `${reservationUrl}/${id}/`;
    return this.http.delete<void>(path, options);
  }
}
