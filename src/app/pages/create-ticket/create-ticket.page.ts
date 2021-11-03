import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CreateTicket, VehicleDetails } from 'src/app/core/models';
import {
  ErrorMessageService,
  LoadingService,
  SnackerService,
  TicketService,
  VehiclesTabStorage,
} from 'src/app/core/services';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.page.html',
  styleUrls: ['./create-ticket.page.scss'],
})
export class CreateTicketPage implements OnInit {
  vehicle: VehicleDetails;
  form: FormGroup;
  reservationId: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private vehiclesTabStorage: VehiclesTabStorage,
    private loadingSrv: LoadingService,
    private errorMessage: ErrorMessageService,
    private ticketService: TicketService,
    private snacker: SnackerService,
    private router: Router
  ) {
    this.vehicle = this.vehiclesTabStorage.getCurrentVehicle();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
    });

    this.route.paramMap.subscribe((paramMap) => {
      this.reservationId = paramMap.get('reservationId');
    });
  }

  async send(): Promise<void> {
    await this.loadingSrv.present();
    const newTicket = this.getTicket();

    this.ticketService
      .create(newTicket)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (ticket) => {
          this.router.navigateByUrl(`members/my-tickets/${ticket.id}`, {
            replaceUrl: true,
          });
          const message = 'Ticket creado con exito';
          const toast = await this.snacker.createSuccessful(message);
          await toast.present();
        },
        async (error) => {
          const message = this.errorMessage.get(error);
          const toast = await this.snacker.createFailed(message);
          await toast.present();
        }
      );
  }

  private getTicket() {
    const title = this.form.value.title;
    const description = this.form.value.description;

    const newTicket: CreateTicket = {
      title,
      description,
      reservation: this.reservationId,
    };

    return newTicket;
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }
}
