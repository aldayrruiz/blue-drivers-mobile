import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incident, Vehicle } from 'src/app/core/models';
import { VehicleIcon, VehicleIconProvider } from 'src/app/core/services';

@Component({
  selector: 'app-my-incidents',
  templateUrl: './my-incidents.page.html',
  styleUrls: ['./my-incidents.page.scss'],
})
export class MyIncidentsPage implements OnInit {
  toolbarTitle = 'Mis Incidencias';
  incidents: Incident[] = [];
  private icons: VehicleIcon[];

  constructor(private vehicleIconProvider: VehicleIconProvider, private route: ActivatedRoute) {
    this.icons = this.vehicleIconProvider.getIcons();
  }

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      this.incidents = response.myIncidents;
    });
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    const icon = this.icons.filter((i) => i.value === vehicle.icon)[0];
    return icon.src;
  }
}
