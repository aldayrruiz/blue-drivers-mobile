import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reservation, Ticket, Vehicle } from 'src/app/core/models';
import { Ghost, SnackerService, TicketService } from 'src/app/core/services';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.page.html',
  styleUrls: ['./ticket-details.page.scss'],
})
export class TicketDetailsPage implements OnInit {
  toolbarTitle = 'Detalles de tu ticket';
  reservation: Reservation;
  vehicle: Vehicle;
  ticket: Ticket;

  constructor(
    private readonly ticketService: TicketService,
    private readonly snacker: SnackerService,
    private readonly route: ActivatedRoute,
    private readonly ghost: Ghost
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
        await this.ghost.goBack(this.route);
        const msg = 'Ticket cancelado con éxito';
        this.snacker.showSuccessful(msg);
      },
      async (errors) => {
        const msg = 'Error cancelando el ticket';
        this.snacker.showFailed(msg);
      }
    );
  }
}
