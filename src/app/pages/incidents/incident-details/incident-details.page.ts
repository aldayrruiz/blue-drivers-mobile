import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incident, Reservation, Vehicle } from 'src/app/core/models';
import { AppRouter, VehicleIcon, VehicleIconProvider } from 'src/app/core/services';
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

  private icons: VehicleIcon[];

  constructor(
    private vehicleIconProvider: VehicleIconProvider,
    private route: ActivatedRoute,
    private appRouter: AppRouter
  ) {
    this.icons = this.vehicleIconProvider.getIcons();
  }

  ngOnInit(): void {
    this.route.data.subscribe(async (response) => {
      this.incident = response.incident;
      this.reservation = this.incident.reservation;
      this.vehicle = this.reservation.vehicle;
      this.photoUrl = await this.getPhotoUrl(this.incident);
    });
  }

  goToReservationDetails() {
    this.appRouter.goToMyReservationDetails(this.reservation.id);
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    const icon = this.icons.filter((i) => i.value === vehicle.icon)[0];
    return icon.src;
  }

  private async getPhotoUrl(incident: Incident) {
    const isPhotoAvailable = incident.photo !== '/media/incidents/none.png';
    const url = `${environment.fleetBaseUrl}${this.incident.photo}`;
    return isPhotoAvailable ? url : '';
  }
}
