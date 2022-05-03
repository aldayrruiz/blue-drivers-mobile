import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reservation, Ticket, Vehicle } from 'src/app/core/models';
import {
  AppRouter,
  SnackerService,
  TicketService,
  VehicleIcon,
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

  private icons: VehicleIcon[];

  constructor(
    private readonly vehicleIconProvider: VehicleIconProvider,
    private readonly ticketService: TicketService,
    private readonly snacker: SnackerService,
    private readonly route: ActivatedRoute,
    private readonly appRouter: AppRouter
  ) {
    this.icons = this.vehicleIconProvider.getIcons();
  }

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
        const msg = 'Ticket cancelado con éxito';
        this.snacker.showSuccessful(msg);
      },
      async (errors) => {
        const msg = 'Error cancelando el ticket';
        this.snacker.showFailed(msg);
      }
    );
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    const icon = this.icons.filter((i) => i.value === vehicle.icon)[0];
    return icon.src;
  }
}
