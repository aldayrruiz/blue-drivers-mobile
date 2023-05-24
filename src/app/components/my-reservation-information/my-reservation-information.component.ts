import { Component, Input, OnInit } from '@angular/core';
import { Reservation, Vehicle } from 'src/app/core/models';
import { AppRouter, VehicleIconProvider } from 'src/app/core/services';

@Component({
  selector: 'app-my-reservation-information',
  templateUrl: './my-reservation-information.component.html',
  styleUrls: ['./my-reservation-information.component.scss'],
})
export class MyReservationInformationComponent implements OnInit {
  @Input() editable: boolean;
  @Input() reservation: Reservation;
  @Input() lines: string;
  @Input() showOwner: boolean;

  constructor(private vehicleIconProvider: VehicleIconProvider, private appRouter: AppRouter) {}

  ngOnInit() {}

  getIconSrcFromVehicle(vehicle: Vehicle) {
    return this.vehicleIconProvider.getFullUrlOrDefaultFromVehicle(vehicle.icon);
  }

  async goToReservation(id: string) {
    await this.appRouter.goToMyReservationDetails(id);
  }

  differentDay(event): boolean {
    const start = new Date(event.start);
    const end = new Date(event.end);

    return start.getUTCDay() !== end.getUTCDay();
  }
}
