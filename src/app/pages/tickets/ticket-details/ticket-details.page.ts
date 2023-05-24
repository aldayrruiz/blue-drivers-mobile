import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reservation, Ticket, Vehicle } from 'src/app/core/models';
import {
  AppRouter,
  SnackerService,
  TicketService,
  VehicleIconProvider,
} from 'src/app/core/services';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.page.html',
  styleUrls: ['./ticket-details.page.scss'],
})
export class TicketDetailsPage implements OnInit {
  toolbarTitle = 'Mis conflictos';
  reservation: Reservation;
  vehicle: Vehicle;
  ticket: Ticket;

  constructor(
    private vehicleIconProvider: VehicleIconProvider,
    private ticketService: TicketService,
    private snacker: SnackerService,
    private route: ActivatedRoute,
    private appRouter: AppRouter
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      this.ticket = response.ticket;
      this.reservation = this.ticket.reservation;
      this.vehicle = this.reservation.vehicle;
    });
  }

  cancelTicket(): void {
    this.ticketService.delete(this.ticket.id).subscribe(
      async () => {
        await this.appRouter.goBack(this.route);
        const msg = 'Conflicto cancelado con éxito';
        await this.snacker.showSuccessful(msg);
      },
      async () => {
        const msg = 'Error cancelando el conflicto';
        await this.snacker.showFailed(msg);
      }
    );
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    return this.vehicleIconProvider.getFullUrlOrDefaultFromVehicle(vehicle.icon);
  }

  differentDay(event): boolean {
    const start = new Date(event.start);
    const end = new Date(event.end);

    return start.getUTCDay() !== end.getUTCDay();
  }
}
