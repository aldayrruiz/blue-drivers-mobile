import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incident, Reservation, Vehicle } from 'src/app/core/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.page.html',
  styleUrls: ['./incident-details.page.scss'],
})
export class IncidentDetailsPage implements OnInit {
  toolbarTitle = 'Detalles de incidencia';

  incident: Incident;
  reservation: Reservation;
  vehicle: Vehicle;
  photoUrl: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(async (response) => {
      this.incident = response.incident;
      this.reservation = this.incident.reservation;
      this.vehicle = this.reservation.vehicle;
      this.photoUrl = await this.getPhotoUrl(this.incident);
    });
  }

  private async getPhotoUrl(incident: Incident) {
    const isPhotoAvailable = incident.photo !== '/media/incidents/none.png';
    const url = `${environment.fleetBaseUrl}${this.incident.photo}`;
    return isPhotoAvailable ? url : '';
  }
}
