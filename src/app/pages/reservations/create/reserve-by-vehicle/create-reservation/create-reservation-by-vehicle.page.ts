import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DatetimeComponent } from 'src/app/components/datetime/datetime.component';
import { ReservationCommonFormComponent } from 'src/app/components/reservation-common-form/reservation-common-form.component';
import { CreateReservation, Vehicle } from 'src/app/core/models';
import {
  AppRouter,
  DateZonerHelper,
  ErrorMessageService,
  LoadingService,
  ReservationService,
  SnackerService,
  VehiclesTabStorage,
} from 'src/app/core/services';
import { combine, initDates, validate } from 'src/app/core/utils/dates/dates';
import { TOOLBAR_TITLE } from '../constants';

@Component({
  selector: 'app-create-reservation-by-vehicle',
  templateUrl: './create-reservation-by-vehicle.page.html',
  styleUrls: ['./create-reservation-by-vehicle.page.scss', '../../../../../../styles.css'],
})
export class CreateReservationByVehiclePage implements OnInit {
  @ViewChild('start') start: DatetimeComponent;
  @ViewChild('end') end: DatetimeComponent;
  @ViewChild(ReservationCommonFormComponent) reservationCommonForm: ReservationCommonFormComponent;
  toolbarTitle = TOOLBAR_TITLE;
  vehicle: Vehicle;
  initStart: string;
  initEnd: string;
  isRecurrent = false;
  isDriverNeeded = false;

  constructor(
    private reservationService: ReservationService,
    private errorMessage: ErrorMessageService,
    private tabStorage: VehiclesTabStorage,
    private loadingSrv: LoadingService,
    private snacker: SnackerService,
    private zoner: DateZonerHelper,
    private route: ActivatedRoute,
    private appRouter: AppRouter
  ) {}

  ngOnInit(): void {
    this.resolveData();
    this.initDates();
  }

  async create() {
    const newReservation = this.getReservation();
    await this.loadingSrv.present();

    // * Validation
    const start = new Date(newReservation.start);
    const end = new Date(newReservation.end);
    const [msg, isValid] = validate(start, end);

    if (!isValid) {
      await this.snacker.showFailed(msg);
      await this.loadingSrv.dismiss();
      return;
    }

    // * Send to server
    this.reservationService
      .create(newReservation)
      .pipe(finalize(async () => await this.loadingSrv.dismiss()))
      .subscribe(
        // newReservation is the response from server - executes if response was ok
        async (reservation) => {
          await this.appRouter.goToMyReservationDetails(reservation.id);
          await this.showSuccessfulMsg();
        },
        // error is the message from the server - executes if response was not ok
        async (error) => await this.showFailedMsg(error)
      );
  }

  private getReservation(): CreateReservation {
    const start = this.start.datetime;
    const end = this.end.datetime;
    return {
      title: this.reservationCommonForm.title.value,
      start: new Date(start).toJSON(),
      end: new Date(end).toJSON(),
      description: this.reservationCommonForm.description.value,
      vehicle: this.vehicle.id,
      is_driver_needed: this.isDriverNeeded,
    };
  }

  private initDates() {
    // Init dates fields from date selected in vehicles details page.
    const from = this.tabStorage.getSelectedDate();
    const { startDate, startTime, endDate, endTime } = initDates(from);
    const start = combine(startDate, startTime);
    const end = combine(endDate, endTime);

    this.initStart = this.zoner.toMyZone(start);
    this.initEnd = this.zoner.toMyZone(end);
  }

  private resolveData() {
    this.route.data.subscribe((response) => {
      this.vehicle = response.vehicle;
    });
  }

  private async showSuccessfulMsg() {
    const msg = 'Reserva creada con éxito';
    await this.snacker.showSuccessful(msg);
  }

  private async showFailedMsg(error) {
    const msg = this.errorMessage.get(error);
    await this.snacker.showFailed(msg);
  }
}
