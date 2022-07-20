import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReservationTemplate } from '../../models';
import { API } from '../../utils/api-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class ReservationTemplateService {
  private baseUrl = `${environment.fleetBaseUrl}${API.reservationTemplates}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ReservationTemplate[]> {
    const path = `${this.baseUrl}/`;
    return this.http.get<ReservationTemplate[]>(path);
  }

  get(id: string): Observable<ReservationTemplate> {
    const path = `${this.baseUrl}/${id}/`;
    return this.http.get<ReservationTemplate>(path);
  }

  delete(id: string): Observable<void> {
    const path = `${this.baseUrl}/${id}/`;
    return this.http.delete<void>(path);
  }
}
