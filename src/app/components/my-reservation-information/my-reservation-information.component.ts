import { Component, Input, OnInit } from '@angular/core';
import { Reservation, Vehicle } from 'src/app/core/models';
import { AppRouter, VehicleIcon, VehicleIconProvider } from 'src/app/core/services';

@Component({
  selector: 'app-my-reservation-information',
  templateUrl: './my-reservation-information.component.html',
  styleUrls: ['./my-reservation-information.component.scss'],
})
export class MyReservationInformationComponent implements OnInit {
  @Input() editable: boolean;
  @Input() reservation: Reservation;
  @Input() lines: string;

  private icons: VehicleIcon[];
  constructor(
    private readonly vehicleIconProvider: VehicleIconProvider,
    private readonly appRouter: AppRouter
  ) {
    this.icons = this.vehicleIconProvider.getIcons();
  }

  ngOnInit() {}

  getIconSrcFromVehicle(vehicle: Vehicle) {
    const icon = this.icons.filter((i) => i.value === vehicle.icon)[0];
    return icon.src;
  }

  async goToReservation(id: string) {
    await this.appRouter.goToReservationDetails(id);
  }

  differentDay(event): boolean {
    const start = new Date(event.start);
    const end = new Date(event.end);

    return start.getUTCDay() !== end.getUTCDay();
  }
}
