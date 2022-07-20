import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CreateTicket, Vehicle } from 'src/app/core/models';
import {
  AppRouter,
  ErrorMessageService,
  LoadingService,
  SnackerService,
  TicketService,
} from 'src/app/core/services';
import { descriptionValidators, titleValidators } from 'src/app/core/utils/validators';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.page.html',
  styleUrls: ['./create-ticket.page.scss'],
})
export class CreateTicketPage implements OnInit {
  toolbarTitle = 'Solicitar cancelación';
  vehicle: Vehicle;
  form: FormGroup;
  reservationId: string;

  constructor(
    private readonly errorMessage: ErrorMessageService,
    private readonly ticketService: TicketService,
    private readonly loadingSrv: LoadingService,
    private readonly snacker: SnackerService,
    private readonly route: ActivatedRoute,
    private readonly ghost: AppRouter,
    private readonly fb: FormBuilder
  ) {}

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.resolveData();
  }

  async send(): Promise<void> {
    await this.loadingSrv.present();
    const newTicket = this.getTicket();

    this.ticketService
      .create(newTicket)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (ticket) => {
          const msg = 'Conflicto creado con éxito';
          await this.ghost.goToTicketDetails(ticket.id);
          await this.snacker.showSuccessful(msg);
        },
        async (error) => {
          const msg = this.errorMessage.get(error);
          await this.snacker.showFailed(msg);
        }
      );
  }

  private initFormGroup() {
    this.form = this.fb.group({
      title: ['', titleValidators],
      description: ['', descriptionValidators],
    });
  }

  private resolveData() {
    this.route.paramMap.subscribe((paramMap) => {
      this.reservationId = paramMap.get('reservationId');
    });
    this.route.data.subscribe((response) => {
      this.vehicle = response.vehicle;
    });
  }

  private getTicket(): CreateTicket {
    return {
      title: this.form.value.title,
      description: this.form.value.description,
      reservation: this.reservationId,
    };
  }
}
