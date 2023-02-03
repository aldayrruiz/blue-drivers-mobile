import { Injectable } from '@angular/core';
import { API } from 'src/app/core/utils/api-paths.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServerUrlService {
  private fleetUrl: string;

  constructor() {
    this.fleetUrl = environment.fleetBaseUrl;
  }

  getVehicles = () => `${this.fleetUrl}${API.vehicles}`;
  getUsers = () => `${this.fleetUrl}${API.users}`;
  getTickets = () => `${this.fleetUrl}${API.tickets}`;
  getIncidents = () => `${this.fleetUrl}${API.incidents}`;
  getReservations = () => `${this.fleetUrl}${API.reservations}`;
  getDiets = () => `${this.fleetUrl}${API.diets}`;
  getDietPayments = () => `${this.fleetUrl}${API.dietPayments}`;
  getDietPhotos = () => `${this.fleetUrl}${API.dietPhotos}`;
  getMobile = () => `${this.fleetUrl}${API.mobile}`;
  getMaintenance = () => `${this.fleetUrl}${API.maintenance}`;
}
