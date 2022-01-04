import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { Reservation, VehicleDetails } from 'src/app/core/models';
import {
  Key,
  ReservationService,
  StorageService,
  VehiclesTabStorage,
} from 'src/app/core/services';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.page.html',
  styleUrls: ['./vehicle-details.page.scss'],
})
export class VehicleDetailsPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  vehicle: VehicleDetails;

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
    private vehiclesTabStorage: VehiclesTabStorage,
    private reservationSrv: ReservationService,
    private alertCtrl: AlertController,
    private storage: StorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.resolveData();
    this.userId = (await this.storage.getParsed(Key.user)).id;
    this.loadReservations(this.reservations);
  }

  loadReservations(reservations: Reservation[]): void {
    this.eventSource = reservations.map((reservation) => ({
      id: reservation.id,
      title: 'Reservado',
      startTime: new Date(reservation.start),
      endTime: new Date(reservation.end),
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
    this.viewTitle = title;
  }

  onTimeSelected(event): void {
    const date = new Date(event.selectedTime);
    this.vehiclesTabStorage.setSelectedDate(date);
  }

  gotToCreateReservationPage(): void {
    this.router.navigateByUrl(
      `members/vehicles/${this.vehicle.id}/create-reservation`
    );
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
    const reservation = this.vehicle.reservations.find(
      (r) => r.id === reservationId
    );
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
    const current = new Date();
    current.setDate(current.getDate() - 1);
    return date < current;
  };

  /**
   * Basically load new reservations corresponded to the month visualized in calendar and its next to months.
   *
   * @param ev Date clicked or changed in calendar
   */
  onCurrentDateChanged(ev: Date) {
    return;

    if (this.selectedMonth !== ev.getUTCMonth()) {
      // ! Just get all
      // const firstDayThisMonth = new Date(
      //   ev.getFullYear(),
      //   ev.getMonth() - 1,
      //   1
      // );
      // const firstDayNextMonth = new Date(
      //   ev.getFullYear(),
      //   ev.getMonth() + 2,
      //   1
      // );
      const options = {
        params: new HttpParams().set('vehicleId', this.vehicle.id),
        // .set('from', firstDayThisMonth.toJSON())
        // .set('to', firstDayNextMonth.toJSON()),
      };
      this.reservationSrv.getAll(options).subscribe((response) => {
        this.loadReservations(response);
      });
      this.selectedMonth = ev.getUTCMonth();
    }
  }

  private async resolveData() {
    this.route.data.subscribe((response) => {
      const { reservations, vehicle } = response.vehicleDetails;
      this.reservations = reservations;
      this.vehicle = vehicle;
    });
  }
}
