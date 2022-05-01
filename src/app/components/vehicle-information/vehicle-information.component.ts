import { Component, Input, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/core/models';
import { VehicleIcon, VehicleIconProvider } from 'src/app/core/services';

@Component({
  selector: 'app-vehicle-information',
  templateUrl: './vehicle-information.component.html',
  styleUrls: ['./vehicle-information.component.scss'],
})
export class VehicleInformationComponent implements OnInit {
  @Input() vehicle: Vehicle;

  iconSrc = 'assets/icon/vehicles/yellow-vehicle.png';

  constructor(private readonly vehicleIconProvider: VehicleIconProvider) {}

  ngOnInit(): void {
    const icons = this.vehicleIconProvider.getIcons();
    this.iconSrc = this.getIconFromVehicle(icons, this.vehicle).src;
  }

  private getIconFromVehicle(icons: VehicleIcon[], vehicle: Vehicle) {
    const icon = icons.filter((i) => i.value === vehicle.icon)[0];
    return icon;
  }
}
