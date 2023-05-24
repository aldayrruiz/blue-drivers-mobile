import { Component, Input, OnInit } from '@angular/core';
import { Vehicle, vehicleTypeLabel } from 'src/app/core/models';
import { VehicleIconProvider } from 'src/app/core/services';

@Component({
  selector: 'app-vehicle-information',
  templateUrl: './vehicle-information.component.html',
  styleUrls: ['./vehicle-information.component.scss'],
})
export class VehicleInformationComponent implements OnInit {
  @Input() vehicle: Vehicle;
  getVehicleTypeLabel = vehicleTypeLabel;

  constructor(private vehicleIconProvider: VehicleIconProvider) {}

  ngOnInit(): void {}

  getIconFromVehicle(vehicle: Vehicle) {
    return this.vehicleIconProvider.getFullUrlOrDefaultFromVehicle(vehicle.icon);
  }
}
