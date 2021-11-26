import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reservation, Ticket, Vehicle } from 'src/app/core/models';
import { GhostService, TicketService } from 'src/app/core/services';
import { SnackerService } from 'src/app/core/services/snacker.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.page.html',
  styleUrls: ['./ticket-details.page.scss'],
})
export class TicketDetailsPage implements OnInit {
  reservation: Reservation;
  vehicle: Vehicle;
  ticket: Ticket;

  constructor(
    private ticketService: TicketService,
    private snacker: SnackerService,
    private route: ActivatedRoute,
    private ghost: GhostService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      console.log('Ticket details response received!');
      this.ticket = response.ticket;
      this.reservation = this.ticket.reservation;
      this.vehicle = this.reservation.vehicle;
    });
  }

  cancelTicket(): void {
    this.ticketService.delete(this.ticket.id).subscribe(
      async () => {
        await this.ghost.goBack(this.route);
        const msg = 'Ticket cancelado con exito';
        this.snacker.showSuccessful(msg);
      },
      async (errors) => {
        const msg = 'Error cancelando el ticket';
        this.snacker.showFailed(msg);
      }
    );
  }
}
