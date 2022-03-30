import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { finalize } from 'rxjs/operators';
import {
  CreateRecurrentReservation,
  Recurrent,
  ReservationTemplate,
  Vehicle,
} from 'src/app/core/models';
import { CreateReservationByDate } from 'src/app/core/models/reservations/by-date/create-reservation-by-date.model';
import {
  DateZonerHelper,
  ErrorMessageService,
  Ghost,
  LoadingService,
  MyReservationsTabStorage,
  ReservationService,
  SnackerService,
  WeekdayCheckbox,
  WeekdaysService,
} from 'src/app/core/services';
import {
  combine,
  initDates,
  nextMonth,
  now,
  serializeDate,
  toDateString,
  validate,
} from 'src/app/core/utils/dates/dates';
import {
  descriptionValidators,
  isRecurrentValidators,
  titleValidators,
  weekdaysValidators,
} from 'src/app/core/utils/validators';

@Component({
  selector: 'app-create-reservation-by-date',
  templateUrl: './create-reservation-by-date.page.html',
  styleUrls: ['./create-reservation-by-date.page.scss'],
})
export class CreateReservationByDatePage implements OnInit {
  toolbarTitle = 'Crear reserva';
  reservationTemplates: ReservationTemplate[] = [];
  form: FormGroup;
  start: string;
  end: string;
  vehicles: Vehicle[] = [];
  weekdays: WeekdayCheckbox[];
  until: string;
  recurrent: Recurrent;

  constructor(
    private readonly tabStorage: MyReservationsTabStorage,
    private readonly reservationSrv: ReservationService,
    private readonly errorMessage: ErrorMessageService,
    private readonly weekdaySrv: WeekdaysService,
    private readonly alertCtrl: AlertController,
    private readonly loadingSrv: LoadingService,
    private readonly zoner: DateZonerHelper,
    private readonly snacker: SnackerService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly ghost: Ghost
  ) {}

  get title(): AbstractControl {
    return this.form.get('title');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  get isRecurrent(): AbstractControl {
    return this.form.get('isRecurrent');
  }

  ngOnInit() {
    this.initData();
    this.initFormGroup();
    this.initDates();
    this.initWeekdaysCheckBoxes();
  }

  async create(isRecurrent: boolean) {
    if (isRecurrent) {
      // * Create Recurrent reservation
      if (new Date(this.until) > now()) {
        await this.createRecurrentReservation();
        return;
      }
      await this.showTryingToCreateRecurrentUntilToday();
    } else {
      // * Create Normal Reservation
      const start = this.start;
      const end = this.end;
      const [msg, datesValid] = validate(start, end);
      if (datesValid) {
        await this.createReservation();
        return;
      }
      this.showDatesAreNotValid(msg);
    }
  }

  async createReservation() {
    const data = this.getData();
    await this.loadingSrv.present();
    this.reservationSrv
      .createByDate(data)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (reservation) => {
          await this.ghost.goToReservationDetails(reservation.id);
          await this.showSuccessfulMessage(false);
        },
        async (error) => {
          if (error.status === 409) {
            await this.showNoneVehiclesAreAvailable();
          } else {
            const msg = this.errorMessage.get(error);
            await this.snacker.showFailed(msg);
          }
        }
      );
  }

  async createRecurrentReservation() {
    this.recurrent = await this.createRecurrent();
    const data = this.getRecurrentReservation(this.recurrent.id);
    await this.loadingSrv.present();
    this.reservationSrv
      .createRecurrentReservations(data, false)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (response) => {
          const reservations = response.successfulReservations;
          if (reservations.length > 0) {
            await this.ghost.goToReservationDetails(reservations[0].id);
            await this.showSuccessfulMessage(true);
          } else {
            // * None reservation was created. Check the fields
            await this.showNoneReservationsWasCreated();
          }
        },
        async (error) => {
          const errorRes = error.error.errorReservations;
          const errorDates = errorRes.map((r) => new Date(r.start));
          if (error.status === 409) {
            await this.showDialogWithImpossibleReservations(errorDates);
          } else {
            await this.showUnknownError();
          }
        }
      );
  }

  async createRecurrent() {
    await this.loadingSrv.present();
    const recurrentData = this.getRecurrent();
    const recurrent = await this.reservationSrv
      .createRecurrent(recurrentData)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
    return recurrent;
  }

  async forceCreateRecurrentReservation() {
    const data = this.getRecurrentReservation(this.recurrent.id);
    await this.loadingSrv.present();
    this.reservationSrv
      .createRecurrentReservations(data, true)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (response) => {
          const reservations = response.successfulReservations;
          if (reservations.length > 0) {
            await this.ghost.goToReservationDetails(reservations[0].id);
            await this.showSuccessfulMessage(true);
          } else {
            await this.showNoneReservationsWasCreatedEvenForced();
          }
        },
        async (error) => await this.showUnknownError()
      );
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.vehicles = ev.detail.complete(this.vehicles);
  }

  private getData() {
    const newReservation: CreateReservationByDate = {
      title: this.form.value.title,
      description: this.form.value.description,
      start: serializeDate(this.start),
      end: serializeDate(this.end),
      weekdays: this.weekdaySrv.getValuesFromCheckBoxes(this.weekdays),
      vehicles: this.vehicles.map((vehicle) => vehicle.id),
    };
    return newReservation;
  }

  private getRecurrentReservation(recurrentId: string): CreateRecurrentReservation {
    return {
      title: this.form.value.title,
      description: this.form.value.description,
      startTime: serializeDate(this.start), // Reservation start time HH:mm (only HH:mm will count)
      endTime: serializeDate(this.end), // Reservation end time (only HH:mm will count)
      recurrent: recurrentId,
      vehicles: this.getVehiclesIds(this.vehicles),
    };
  }

  private getRecurrent(): Recurrent {
    const since = serializeDate(new Date()); // Reservations will be created since now
    const until = serializeDate(this.until); // Until
    const weekdays = this.weekdaySrv.getValuesFromCheckBoxes(this.weekdays);

    return {
      since,
      until,
      weekdays: weekdays.toString(),
    };
  }

  private getVehiclesIds(vehicles: Vehicle[]): string[] {
    return vehicles.map((vehicle) => vehicle.id);
  }

  private initFormGroup() {
    this.form = this.fb.group({
      title: ['', titleValidators],
      description: ['', descriptionValidators],
      isRecurrent: [false, isRecurrentValidators],
      weekdays: [[], weekdaysValidators],
    });
  }

  private initDates() {
    const from = this.tabStorage.getDate();
    const { startDate, startTime, endDate, endTime } = initDates(from);
    const start = combine(startDate, startTime);
    const end = combine(endDate, endTime);

    this.start = this.zoner.toMyZone(start);
    this.end = this.zoner.toMyZone(end);
    this.until = this.zoner.toMyZone(nextMonth(now()));
  }

  private initData() {
    this.route.data.subscribe((response) => {
      this.vehicles = response.vehicles;
      this.reservationTemplates = response.reservationTemplates;
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
      <ion-label>${toDateString(date)}</ion-label>
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

  private async showTryingToCreateRecurrentUntilToday() {
    const msg = 'El campo hasta cuando no debe ser hoy.';
    await this.snacker.showFailed(msg);
  }

  private async showNoneVehiclesAreAvailable() {
    const msg = 'No hay vehículos disponibles';
    await this.snacker.showFailed(msg);
  }

  private async showDatesAreNotValid(msg: string) {
    await this.snacker.showFailed(msg);
  }

  private async showUnknownError() {
    const msg = 'Error desconocido.';
    await this.snacker.showFailed(msg);
  }

  private async showNoneReservationsWasCreated() {
    const msg = 'Ninguna reserva creada. Comprueba los campos.';
    await this.snacker.showFailed(msg);
  }

  private async showNoneReservationsWasCreatedEvenForced() {
    const msg = 'Se han forzado. Pero no se ha podido crear ninguna.';
    await this.snacker.showFailed(msg);
  }

  private async showSuccessfulMessage(recurrent: boolean) {
    const normalMsg = 'Reserva creada con éxito';
    const recurrentMsg = 'Reservas creadas con éxito';
    const msg = recurrent ? recurrentMsg : normalMsg;
    await this.snacker.showSuccessful(msg);
  }

  private async showDialogWithImpossibleReservations(dates: Date[]) {
    const alert = await this.alertCtrl.create({
      message: this.getThereAreErrorReservationsMsg(dates),
      buttons: this.getThereAreErrorReservationsButtons(),
    });
    await alert.present();
  }
}
