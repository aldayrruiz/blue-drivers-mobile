import { Injectable } from '@angular/core';
import { ApiPaths } from 'src/app/shared/api-paths.enum';
import { FastStorageService } from '.';

@Injectable({
  providedIn: 'root',
})
export class ServerUrlService {
  constructor(private fS: FastStorageService) {}

  getVehicles = () => `${this.fS.getBaseUrl()}${ApiPaths.vehicle}`;
  getUsers = () => `${this.fS.getBaseUrl()}${ApiPaths.user}`;
  getTickets = () => `${this.fS.getBaseUrl()}${ApiPaths.ticket}`;
  getIncidents = () => `${this.fS.getBaseUrl()}${ApiPaths.incident}`;
  getReservations = () => `${this.fS.getBaseUrl()}${ApiPaths.reservation}`;
}
