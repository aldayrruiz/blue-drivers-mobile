import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incident, Reservation, Vehicle } from 'src/app/core/models';
import { AppRouter, VehicleIconProvider } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.page.html',
  styleUrls: ['./incident-details.page.scss'],
})
export class IncidentDetailsPage implements OnInit {
  toolbarTitle = 'Mis incidencias';

  incident: Incident;
  reservation: Reservation;
  vehicle: Vehicle;
  photoUrl: string;

  constructor(
    private vehicleIconProvider: VehicleIconProvider,
    private route: ActivatedRoute,
    private appRouter: AppRouter
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(async (response) => {
      this.incident = response.incident;
      this.reservation = this.incident.reservation;
      this.vehicle = this.reservation.vehicle;
      this.photoUrl = await this.getPhotoUrl(this.incident);
    });
  }

  async goToReservationDetails() {
    await this.appRouter.goToMyReservationDetails(this.reservation.id);
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    return this.vehicleIconProvider.getFullUrlOrDefaultFromVehicle(vehicle.icon);
  }

  private async getPhotoUrl(incident: Incident) {
    const isPhotoAvailable = incident.photo !== '/media/incidents/none.png';
    const url = `${environment.fleetBaseUrl}${this.incident.photo}`;
    return isPhotoAvailable ? url : '';
  }
}
