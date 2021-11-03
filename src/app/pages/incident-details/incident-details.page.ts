import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incident, Reservation, Vehicle } from 'src/app/core/models';
import { Key, StorageService } from 'src/app/core/services';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.page.html',
  styleUrls: ['./incident-details.page.scss'],
})
export class IncidentDetailsPage implements OnInit {
  incident: Incident;
  reservation: Reservation;
  vehicle: Vehicle;
  serverUrl: string;
  photoUrl: string;

  constructor(
    private route: ActivatedRoute,
    private storageSrv: StorageService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(async (response) => {
      this.incident = response.incident;
      this.reservation = this.incident.reservation;
      this.vehicle = this.reservation.vehicle;
      this.photoUrl = await this.getPhotoUrl(this.incident);
    });
  }

  private async getPhotoUrl(incident: Incident) {
    this.serverUrl = await this.storageSrv.getP(Key.serverUrl);
    if (incident.photo !== '/media/incidents/none.png') {
      const photoUrl = `${this.serverUrl}${this.incident.photo}`;
      return photoUrl;
    }
    return '';
  }
}
