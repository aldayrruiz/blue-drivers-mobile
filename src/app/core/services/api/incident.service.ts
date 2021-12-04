import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from '..';
import { CreateIncident, Incident } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private http: HttpClient, private urlSrv: ServerUrlService) {}

  create(incident: CreateIncident): Observable<CreateIncident> {
    const incidentUrl = this.urlSrv.getIncidents();
    const path = `${incidentUrl}/`;
    return this.http.post<CreateIncident>(path, incident);
  }

  getAll(): Observable<Incident[]> {
    const incidentUrl = this.urlSrv.getIncidents();
    const path = `${incidentUrl}/`;
    return this.http.get<Incident[]>(path);
  }

  get(id: string): Observable<Incident> {
    const incidentUrl = this.urlSrv.getIncidents();
    const path = `${incidentUrl}/${id}/`;
    return this.http.get<Incident>(path);
  }
}
