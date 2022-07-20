import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket, Vehicle } from 'src/app/core/models';
import { VehicleIcon, VehicleIconProvider } from 'src/app/core/services';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.page.html',
  styleUrls: ['./my-tickets.page.scss'],
})
export class MyTicketsPage implements OnInit {
  toolbarTitle = 'Mis conflictos';

  tickets: Ticket[] = [];
  private icons: VehicleIcon[];

  constructor(
    private readonly vehicleIconProvider: VehicleIconProvider,
    private readonly route: ActivatedRoute
  ) {
    this.icons = this.vehicleIconProvider.getIcons();
  }

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      this.tickets = response.myTickets;
    });
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    const icon = this.icons.filter((i) => i.value === vehicle.icon)[0];
    return icon.src;
  }
}
