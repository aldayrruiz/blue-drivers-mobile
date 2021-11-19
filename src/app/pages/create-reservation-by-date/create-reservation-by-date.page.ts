import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { finalize } from 'rxjs/operators';
import { CreateRecurrentReservation, Vehicle } from 'src/app/core/models';
import { CreateReservationByDate } from 'src/app/core/models/create/create-reservation-by-date.model';
import {
  CalModalService,
  ErrorMessageService,
  LoadingService,
  MyDateService,
  ReservationService,
  SnackerService,
  WeekdayCheckbox,
  WeekdaysService,
} from 'src/app/core/services';
import { DESC_LEN, TITLE_LEN } from 'src/app/shared/utils/fields-config';
import { CalModalPage } from '../cal-modal/cal-modal.page';

@Component({
  selector: 'app-create-reservation-by-date',
  templateUrl: './create-reservation-by-date.page.html',
  styleUrls: ['./create-reservation-by-date.page.scss'],
})
export class CreateReservationByDatePage implements OnInit {
  form: FormGroup;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  vehicles: Vehicle[] = [];
  weekdays: WeekdayCheckbox[];
  untilDate: Date;

  constructor(
    private reservationSrv: ReservationService,
    private errorMessage: ErrorMessageService,
    private calModalService: CalModalService,
    private weekdaySrv: WeekdaysService,
    private alertCtrl: AlertController,
    private loadingSrv: LoadingService,
    private modalCtrl: ModalController,
    private snacker: SnackerService,
    private dateSrv: MyDateService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.initData();
    this.initFormGroup();
    this.initDates();
    this.initWeekdaysCheckBoxes();
  }

  async create(isRecurrent: boolean) {
    if (this.endDate <= this.startDate) {
      const message = 'La fecha de comienzo debe ser anterior a la final';
      const toast = await this.snacker.createFailed(message);
      await toast.present();
      return;
    }
    if (isRecurrent) {
      const data = this.getRecurrentData();
      this.createRecurrentReservation(data);
    } else {
      const data = this.getData();
      this.createReservation(data);
    }
  }

  async createReservation(data: CreateReservationByDate) {
    await this.loadingSrv.present();
    this.reservationSrv
      .createByDate(data)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        // newReservation is the response from server - executes if response was ok
        async (reservation) => {
          this.router.navigate(['..', reservation.id], {
            relativeTo: this.route,
          });
          const message = 'Reserva creada con exito';
          const toast = await this.snacker.createSuccessful(message);
          await toast.present();
        },
        // error is the message from the server - executes if response was not ok
        async (error) => {
          const message = this.errorMessage.get(error);
          const toast = await this.snacker.createFailed(message);
          await toast.present();
        }
      );
  }

  async createRecurrentReservation(data: CreateRecurrentReservation) {
    await this.loadingSrv.present();
    this.reservationSrv
      .createRecurrent(data, false)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (response) => {
          const reservations = response.successfulReservations;
          if (reservations.length === 0) {
            const message = 'Ninguna reserva creada. Comprueba los campos.';
            const toast = await this.snacker.createFailed(message);
            await toast.present();
          } else {
            const firstReservation = reservations[0];
            this.goToReservationDetails(firstReservation.id);
            const message = 'Reservas creadas con exito';
            const toast = await this.snacker.createSuccessful(message);
            await toast.present();
          }
        },
        async (error) => {
          const errorRes = error.error.errorReservations;
          const errorDates = errorRes.map((r) => new Date(r.start));
          if (error.status === 409) {
            const alert = await this.alertCtrl.create({
              message: this.getThereAreErrorReservationsMsg(errorDates),
              buttons: this.getThereAreErrorReservationsButtons(),
            });
            await alert.present();
          }
        }
      );
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  get isRecurrent(): AbstractControl {
    return this.form.get('isRecurrent');
  }

  async openCalModal(type: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CalModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: false,
    });

    if (type === 'start') {
      this.calModalService.setDate(this.startDate);
    } else if (type === 'end') {
      this.calModalService.setDate(this.endDate);
    } else {
      this.calModalService.setDate(this.untilDate);
    }

    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        const date = result.data.event.date;

        if (type === 'start') {
          this.startDate = date;
        } else if (type === 'end') {
          this.endDate = date;
        } else {
          this.untilDate = date;
        }
      }
    });
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.vehicles = ev.detail.complete(this.vehicles);
  }

  private getData() {
    const hmStart = new Date(this.startTime);
    const hmEnd = new Date(this.endTime);
    this.startDate.setHours(hmStart.getHours());
    this.startDate.setMinutes(hmStart.getMinutes());
    this.endDate.setHours(hmEnd.getHours());
    this.endDate.setMinutes(hmEnd.getMinutes());

    const start = this.dateSrv.removeSeconds(this.startDate);
    const end = this.dateSrv.removeSeconds(this.endDate);

    const title = this.form.value.title;
    const description = this.form.value.description;

    const vehicles = this.vehicles.map((vehicle) => vehicle.id);
    const weekdays = this.weekdaySrv.getValuesFromCheckBoxes(this.weekdays);

    const newReservation: CreateReservationByDate = {
      title,
      start: start.toJSON(),
      end: end.toJSON(),
      weekdays,
      description,
      vehicles,
    };
    return newReservation;
  }

  private goToReservationDetails(reservationId: string) {
    this.router.navigateByUrl(`members/my-reservations/${reservationId}`);
  }

  private getRecurrentData() {
    const { title, description } = this.form.value;
    const weekdays = this.weekdaySrv.getValuesFromCheckBoxes(this.weekdays);
    const startReservationTime = this.dateSrv
      .removeSeconds(new Date(this.startTime))
      .toJSON();
    const endReservationTime = this.dateSrv
      .removeSeconds(new Date(this.endTime))
      .toJSON();

    const startReservations = this.dateSrv
      .removeSeconds(new Date(startReservationTime))
      .toJSON();
    const endReservations = this.dateSrv.removeSeconds(this.untilDate).toJSON();
    const vehicles = this.getVehiclesIds(this.vehicles);

    return {
      title,
      description,
      weekdays,
      startReservationTime,
      endReservationTime,
      startReservations,
      endReservations,
      vehicles,
    };
  }

  private async forceCreateRecurrentReservation() {
    await this.loadingSrv.present();
    const data = this.getRecurrentData();
    this.reservationSrv
      .createRecurrent(data, true)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (response) => {
          if (response.successfulReservations.length === 0) {
            const message =
              'Se han forzado. Pero no se ha podido crear ninguna.';
            const toast = await this.snacker.createFailed(message);
            await toast.present();
          } else {
            const message = 'Las reservas se han creado exitosamente';
            const toast = await this.snacker.createSuccessful(message);
            await toast.present();
            this.goToReservationDetails(response.successfulReservations[0].id);
          }
        },
        async (error) => {
          const status = error?.error?.status;
          const message = `Error desconocido. Intentalo mas tarde`;
          const toast = await this.snacker.createFailed(message);
          await toast.present();
        }
      );
  }

  private getVehiclesIds(vehicles: Vehicle[]): string[] {
    return vehicles.map((vehicle) => vehicle.id);
  }

  private initFormGroup() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(TITLE_LEN)]],
      description: ['', [Validators.required, Validators.maxLength(DESC_LEN)]],
      isRecurrent: [false, [Validators.required]],
      weekdays: [[], []],
    });
  }

  private initDates() {
    const now = new Date();
    this.startDate = new Date(now);
    const hms = this.dateSrv.getHmEach15m(now);
    this.startTime = hms.toISOString();

    // Set end date
    const hme = this.dateSrv.getHmEach15m(now);
    hme.setHours(hms.getHours() + 1);
    this.endTime = hme.toISOString();
    this.endDate = new Date(this.startTime);
    this.endDate.setHours(this.startDate.getHours() + 1);

    this.untilDate = new Date();
    this.untilDate.setUTCMonth(new Date().getUTCMonth() + 1);
  }

  private initData() {
    this.route.data.subscribe((response) => {
      this.vehicles = response.vehicles;
    });
  }

  private initWeekdaysCheckBoxes() {
    this.weekdays = this.weekdaySrv.getCheckboxes();
  }

  private getThereAreErrorReservationsMsg(dates: Date[]) {
    let datesInAList = '';
    dates.forEach((date) => {
      datesInAList = datesInAList.concat(this.getElementHtml(date));
    });

    const message = `
      <p>Las siguientes reservas no pueden ser creadas porque no hay ningun vehículo disponible.</p>
      <ion-list>
        ${datesInAList}
      </ion-list>
    `;
    return message;
  }

  private getElementHtml(date: Date) {
    const elementTemplate = `
    <ion-item>
      <ion-label>${this.dateSrv.toDateString(date)}</ion-label>
    </ion-item>
    `;
    return elementTemplate;
  }

  private getThereAreErrorReservationsButtons() {
    return [
      {
        text: 'Forzar reserva',
        handler: async () => {
          this.forceCreateRecurrentReservation();
        },
      },
      {
        text: 'Cancelar',
      },
    ];
  }
}
