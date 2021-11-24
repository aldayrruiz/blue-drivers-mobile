import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
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
import {
  combineAndSerialize,
  getStartEndDateTimes,
  nextMonth,
  now,
  serializeDate,
} from 'src/app/shared/utils/dates';
import {
  descriptionValidators,
  isRecurrentValidators,
  titleValidators,
  weekdaysValidators,
} from 'src/app/shared/utils/validators';
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
      await this.createRecurrentReservation(data);
    } else {
      const data = this.getData();
      await this.createReservation(data);
    }
  }

  async createReservation(data: CreateReservationByDate) {
    await this.loadingSrv.present();
    this.reservationSrv
      .createByDate(data)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (reservation) => {
          this.showSuccessfulMessage(false);
          this.goToReservationDetails(reservation.id);
        },
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
          if (reservations.length > 0) {
            this.showSuccessfulMessage(true);
            this.goToReservationDetails(reservations[0].id);
          } else {
            // * None reservation was created. Check the fields
            this.showNoneReservationsWasCreated();
          }
        },
        async (error) => {
          const errorRes = error.error.errorReservations;
          const errorDates = errorRes.map((r) => new Date(r.start));
          if (error.status === 409) {
            this.showDialogWithImpossibleReservations(errorDates);
          } else {
            this.showUnknownError();
          }
        }
      );
  }

  async forceCreateRecurrentReservation() {
    await this.loadingSrv.present();
    const data = this.getRecurrentData();
    this.reservationSrv
      .createRecurrent(data, true)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (response) => {
          const reservations = response.successfulReservations;
          if (reservations.length > 0) {
            this.showSuccessfulMessage(true);
            this.goToReservationDetails(response.successfulReservations[0].id);
          } else {
            this.showNoneReservationsWasCreatedEvenForced();
          }
        },
        async (error) => this.showUnknownError()
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
    const newReservation: CreateReservationByDate = {
      title: this.form.value.title,
      description: this.form.value.description,
      start: combineAndSerialize(this.startDate, this.startTime),
      end: combineAndSerialize(this.endDate, this.endTime),
      weekdays: this.weekdaySrv.getValuesFromCheckBoxes(this.weekdays),
      vehicles: this.vehicles.map((vehicle) => vehicle.id),
    };
    return newReservation;
  }

  private goToReservationDetails(id: string) {
    this.router.navigate(['..', id], { relativeTo: this.route });
  }

  private getRecurrentData() {
    return {
      title: this.form.value.title,
      description: this.form.value.description,
      weekdays: this.weekdaySrv.getValuesFromCheckBoxes(this.weekdays),
      startReservationTime: serializeDate(this.startTime), // Reservation start time HH:mm (only HH:mm will count)
      endReservationTime: serializeDate(this.endTime), // Reservation end time (only HH:mm will count)
      startReservations: serializeDate(new Date()), // Reservations will be created since now
      endReservations: serializeDate(this.untilDate), // Until
      vehicles: this.getVehiclesIds(this.vehicles),
    };
  }

  private getVehiclesIds(vehicles: Vehicle[]): string[] {
    return vehicles.map((vehicle) => vehicle.id);
  }

  private initFormGroup() {
    this.form = this.fb.group({
      title: titleValidators,
      description: descriptionValidators,
      isRecurrent: isRecurrentValidators,
      weekdays: weekdaysValidators,
    });
  }

  private initDates() {
    const { startDate, startTime, endDate, endTime } = getStartEndDateTimes();
    this.startDate = startDate;
    this.startTime = startTime;
    this.endDate = endDate;
    this.endTime = endTime;
    this.untilDate = nextMonth(now());
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

  private async showUnknownError() {
    const message = 'Error desconocido.';
    const toast = await this.snacker.createFailed(message);
    await toast.present();
  }

  private async showNoneReservationsWasCreated() {
    const message = 'Ninguna reserva creada. Comprueba los campos.';
    const toast = await this.snacker.createFailed(message);
    await toast.present();
  }

  private async showNoneReservationsWasCreatedEvenForced() {
    const message = 'Se han forzado. Pero no se ha podido crear ninguna.';
    const toast = await this.snacker.createFailed(message);
    await toast.present();
  }

  private async showSuccessfulMessage(recurrent: boolean) {
    const normalMsg = 'Reserva creada con exito';
    const recurrentMsg = 'Reservas creadas con exito';
    const msg = recurrent ? recurrentMsg : normalMsg;
    const toast = await this.snacker.createSuccessful(msg);
    await toast.present();
  }

  private async showDialogWithImpossibleReservations(dates: Date[]) {
    const alert = await this.alertCtrl.create({
      message: this.getThereAreErrorReservationsMsg(dates),
      buttons: this.getThereAreErrorReservationsButtons(),
    });
    await alert.present();
  }
}
