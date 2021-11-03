import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation, Ticket, Vehicle } from 'src/app/core/models';
import { TicketService } from 'src/app/core/services';
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
    private route: ActivatedRoute,
    private snacker: SnackerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((response) => {
      console.log('Ticket details response received!');
      this.ticket = response.ticket;
      console.log(this.ticket);
      this.reservation = this.ticket.reservation;
      this.vehicle = this.reservation.vehicle;
    });
  }

  cancelTicket(): void {
    this.ticketService.delete(this.ticket.id).subscribe(
      async () => {
        this.router.navigateByUrl('members/my-tickets', {
          replaceUrl: true,
        });
        const message = 'Ticket cancelado con exito';
        const toast = await this.snacker.createSuccessful(message);
        await toast.present();
      },
      async (errors) => {
        const message = 'Error cancelando el ticket';
        const toast = await this.snacker.createFailed(message);
        await toast.present();
      }
    );
  }
}
