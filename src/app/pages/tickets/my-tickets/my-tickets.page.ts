import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket, Vehicle } from 'src/app/core/models';
import { VehicleIconProvider } from 'src/app/core/services';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.page.html',
  styleUrls: ['./my-tickets.page.scss'],
})
export class MyTicketsPage implements OnInit {
  toolbarTitle = 'Mis conflictos';

  tickets: Ticket[] = [];

  constructor(private vehicleIconProvider: VehicleIconProvider, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      this.tickets = response.myTickets;
    });
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    return this.vehicleIconProvider.getFullUrlOrDefaultFromVehicle(vehicle.icon);
  }
}
