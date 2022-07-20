import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { fuelLabel, Reservation, VehicleDetails } from 'src/app/core/models';
import { Key, ReservationService, StorageService, VehiclesTabStorage } from 'src/app/core/services';
import { TOOLBAR_TITLE } from '../constants';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.page.html',
  styleUrls: ['./vehicle-details.page.scss'],
})
export class ReserveByVehiclePage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  toolbarTitle = TOOLBAR_TITLE;
  segmentValue = 'reserve';

  vehicle: VehicleDetails;
  fuel: string;

  userId: string;
  eventSource = [];
  viewTitle: string;
  selectedMonth: number;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    noEventsLabel: 'No hay reservas aún',
  };

  selectedDate: Date;
  reservations: Reservation[] = [];
  constructor(
    private readonly vehiclesTabStorage: VehiclesTabStorage,
    private readonly reservationSrv: ReservationService,
    private readonly alertCtrl: AlertController,
    private readonly storage: StorageService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  async ngOnInit() {
    await this.resolveData();
    this.userId = (await this.storage.getParsed(Key.user)).id;
    this.loadReservations(this.reservations);
  }

  segmentChanged = (e) => (this.segmentValue = e.detail.value);

  loadReservations(reservations: Reservation[]): void {
    this.eventSource = reservations.map((reservation) => ({
      id: reservation.id,
      title: 'Reservado',
      startTime: new Date(reservation.start),
      endTime: new Date(reservation.end),
      owner: {
        email: reservation.owner.email,
        fullname: reservation.owner.fullname,
      },
    }));

    this.reservations = reservations;
    this.myCal.loadEvents();
  }

  next(): void {
    this.myCal.slideNext();
  }

  back(): void {
    this.myCal.slidePrev();
  }

  onViewTitleChanged(title: string): void {
    console.log('onViewTitleChanged', title);
    this.viewTitle = title;
  }

  onTimeSelected(event): void {
    console.log('onTimeSelected', event);
    const date = new Date(event.selectedTime);
    this.vehiclesTabStorage.setSelectedDate(date);
  }

  gotToCreateReservationPage(): void {
    this.router.navigateByUrl(`members/vehicles/${this.vehicle.id}/create-reservation`);
  }

  getFormattedHoursAndMinutes(date: Date): string {
    const str = date.toLocaleTimeString();
    return str.slice(0, -3);
  }

  async selectReservation(reservationId: string): Promise<void> {
    const alertElement = await this.alertCtrl.create({
      message: '¿Deseas pedir que el propietario cancele su reserva?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Si',
          handler: () => {
            this.router.navigateByUrl(
              `members/vehicles/${this.vehicle.id}/create-ticket/${reservationId}`
            );
          },
        },
      ],
    });

    await alertElement.present(); // Mostrar al usuario
  }

  isMine(reservationId: string): boolean {
    const reservation = this.vehicle.reservations.find((r) => r.id === reservationId);
    return reservation.owner.id === this.userId;
  }

  differentDay(event): boolean {
    const start = event.startTime;
    const end = event.endTime;

    return start.getUTCDay() !== end.getUTCDay();
  }

  alreadyStarted(id: string) {
    const reservation = this.reservations.find((r) => r.id === id);

    const start = new Date(reservation.start);
    const now = new Date();
    return start <= now;
  }

  markDisabled = (date: Date) => {
    // Sometimes, yesterday is not marked as disabled. Zone times GTM+0100 & GTM+0200
    const current = new Date();
    current.setUTCDate(current.getUTCDate() - 1);
    return date < current;
  };

  /**
   * Basically load new reservations corresponded to the month visualized in calendar and its next to months.
   *
   * @param ev Date clicked or changed in calendar
   */
  onCurrentDateChanged(ev: Date) {
    return;
  }

  private async resolveData() {
    this.route.data.subscribe((response) => {
      const { vehicle } = response.vehicleDetails;
      this.reservations = vehicle.reservations;
      this.vehicle = vehicle;
      this.fuel = fuelLabel(vehicle.fuel);
    });
  }
}
