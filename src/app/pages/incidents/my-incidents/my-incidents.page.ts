import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getIncidentTypeLabel, Incident, Vehicle } from 'src/app/core/models';
import { VehicleIconProvider } from 'src/app/core/services';

@Component({
  selector: 'app-my-incidents',
  templateUrl: './my-incidents.page.html',
  styleUrls: ['./my-incidents.page.scss'],
})
export class MyIncidentsPage implements OnInit {
  // Variables
  toolbarTitle = 'Mis Incidencias';
  incidents: Incident[] = [];

  // Functions
  getIncidentTypeLabel = getIncidentTypeLabel;

  constructor(private vehicleIconProvider: VehicleIconProvider, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      this.incidents = response.myIncidents;
    });
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    return this.vehicleIconProvider.getFullUrlOrDefaultFromVehicle(vehicle.icon);
  }
}
