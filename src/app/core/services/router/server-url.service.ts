import { Injectable } from '@angular/core';
import { ApiPaths } from 'src/app/core/utils/api-paths.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServerUrlService {
  private fleetUrl: string;

  constructor() {
    this.fleetUrl = environment.fleetBaseUrl;
  }

  getVehicles = () => `${this.fleetUrl}${ApiPaths.vehicle}`;
  getUsers = () => `${this.fleetUrl}${ApiPaths.user}`;
  getTickets = () => `${this.fleetUrl}${ApiPaths.ticket}`;
  getIncidents = () => `${this.fleetUrl}${ApiPaths.incident}`;
  getReservations = () => `${this.fleetUrl}${ApiPaths.reservation}`;
}
