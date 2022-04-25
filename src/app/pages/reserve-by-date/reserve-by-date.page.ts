import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { finalize } from 'rxjs/operators';
import { DatetimeComponent } from 'src/app/components/datetime/datetime.component';
import { ReservationCommonFormComponent } from 'src/app/components/reservation-common-form/reservation-common-form.component';
import { CreateRecurrentReservation, Recurrent, Vehicle } from 'src/app/core/models';
import { CreateReservationByDate } from 'src/app/core/models/reservations/by-date/create-reservation-by-date.model';
import {
  AppRouter,
  DateZonerHelper,
  ErrorMessageService,
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

@Component({
  selector: 'app-reserve-by-date',
  templateUrl: './reserve-by-date.page.html',
  styleUrls: ['./reserve-by-date.page.scss'],
})
export class ReserveByDatePage implements OnInit {
  // Date form
  @ViewChild('start') start: DatetimeComponent;
  @ViewChild('end') end: DatetimeComponent;
  @ViewChild('until') until: DatetimeComponent;
  @ViewChild(ReservationCommonFormComponent) reservationCommonForm: ReservationCommonFormComponent;
  initStart: string;
  initEnd: string;
  initUntil: string;

  // Title & Description form
  toolbarTitle = 'Reserva por fecha';
  vehicles: Vehicle[] = [];
  weekdays: WeekdayCheckbox[];
  isRecurrent: boolean;
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
    private readonly appRouter: AppRouter
  ) {}

  ngOnInit() {
    this.initData();
    this.initDates();
    this.initWeekdaysCheckBoxes();
  }

  async create() {
    if (this.isRecurrent) {
      // * Create Recurrent reservation
      if (new Date(this.until.datetime) > now()) {
        await this.createRecurrentReservation();
        return;
      }
      await this.showTryingToCreateRecurrentUntilToday();
    } else {
      // * Create Normal Reservation
      const start = this.start.datetime;
      const end = this.end.datetime;
      const [msg, datesValid] = validate(start, end);
      if (datesValid) {
        await this.createReservation();
        return;
      }
      this.showDatesAreNotValid(msg);
    }
  }

  async createReservation() {
    const data = this.getReservationData();
    await this.loadingSrv.present();
    this.reservationSrv
      .createByDate(data)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (reservation) => {
          await this.appRouter.goToReservationDetails(reservation.id);
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
    const data = this.getRecurrentReservationData(this.recurrent.id);
    await this.loadingSrv.present();
    this.reservationSrv
      .createRecurrentReservations(data, false)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (response) => {
          const reservations = response.successfulReservations;
          if (reservations.length > 0) {
            await this.appRouter.goToReservationDetails(reservations[0].id);
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
    const recurrentData = this.getRecurrentData();
    const recurrent = await this.reservationSrv
      .createRecurrent(recurrentData)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .toPromise();
    return recurrent;
  }

  async forceCreateRecurrentReservation() {
    const data = this.getRecurrentReservationData(this.recurrent.id);
    await this.loadingSrv.present();
    this.reservationSrv
      .createRecurrentReservations(data, true)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        async (response) => {
          const reservations = response.successfulReservations;
          if (reservations.length > 0) {
            await this.appRouter.goToReservationDetails(reservations[0].id);
            await this.showSuccessfulMessage(true);
          } else {
            await this.showNoneReservationsWasCreatedEvenForced();
          }
        },
        async () => await this.showUnknownError()
      );
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.vehicles = ev.detail.complete(this.vehicles);
  }

  /**
   * Returns Data to create a reservation.
   */
  private getReservationData() {
    const newReservation: CreateReservationByDate = {
      ...this.getCommonData(),
      start: serializeDate(this.start.datetime),
      end: serializeDate(this.end.datetime),
      weekdays: this.weekdaySrv.getValuesFromCheckBoxes(this.weekdays),
    };
    return newReservation;
  }

  /**
   * Returns Data to create a recurrent reservation.
   */
  private getRecurrentReservationData(recurrentId: string): CreateRecurrentReservation {
    return {
      ...this.getCommonData(),
      startTime: serializeDate(this.start.datetime), // Reservation start time HH:mm (only HH:mm will count)
      endTime: serializeDate(this.end.datetime), // Reservation end time (only HH:mm will count)
      recurrent: recurrentId,
    };
  }

  private getCommonData() {
    return {
      title: this.reservationCommonForm.title.value,
      description: this.reservationCommonForm.description.value,
      vehicles: this.getVehiclesIds(this.vehicles),
    };
  }

  /**
   * Return data to create a recurrent instance.
   */
  private getRecurrentData(): Recurrent {
    const since = serializeDate(new Date()); // Reservations will be created since now
    const until = serializeDate(this.until.datetime); // Until
    const weekdays = this.weekdaySrv.getValuesFromCheckBoxes(this.weekdays).toString();
    return { since, until, weekdays };
  }

  private getVehiclesIds = (vehicles: Vehicle[]) => vehicles.map((vehicle) => vehicle.id);

  private initDates() {
    const { startDate, startTime, endDate, endTime } = initDates();
    const start = combine(startDate, startTime);
    const end = combine(endDate, endTime);

    this.initStart = this.zoner.toMyZone(start);
    this.initEnd = this.zoner.toMyZone(end);
    this.initUntil = this.zoner.toMyZone(nextMonth(now()));
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
      <p>Las siguientes reservas no pueden ser creadas porque no hay ningún vehículo disponible.</p>
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
