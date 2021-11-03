import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from '.';
import { CreateTicket, Ticket } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private http: HttpClient, private urlSrv: ServerUrlService) {}

  /**
   * Sends a GET HTTP request to the server to get a list of tickets.
   */
  getAll(): Observable<Ticket[]> {
    const ticketUrl = this.urlSrv.getTickets();
    const path = `${ticketUrl}/`;
    return this.http.get<Ticket[]>(path);
  }

  /**
   * Sends a GET HTTP request to the server to get a ticket given an identifier.
   *
   * @param id identifier of the ticket to get.
   */
  get(id: string): Observable<Ticket> {
    const ticketUrl = this.urlSrv.getTickets();
    const path = `${ticketUrl}/${id}/`;
    return this.http.get<Ticket>(path);
  }

  /**
   * Send a POST HTTP request to the server to store the given ticket data.
   *
   * @param ticket data of the ticket to store.
   */
  create(ticket: CreateTicket): Observable<CreateTicket> {
    const ticketUrl = this.urlSrv.getTickets();
    const path = `${ticketUrl}/`;
    return this.http.post<CreateTicket>(path, ticket);
  }

  /**
   * Sends a DELETE HTTP request to the server to delete the resource.
   *
   * @param id Reservation's id to delete
   */
  delete(id: string): Observable<void> {
    const ticketUrl = this.urlSrv.getTickets();
    const path = `${ticketUrl}/${id}/`;
    return this.http.delete<void>(path);
  }
}
