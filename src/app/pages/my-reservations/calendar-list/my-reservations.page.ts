import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from 'ionic2-calendar';
import { Reservation, Vehicle } from 'src/app/core/models';
import {
  AppRouter,
  MyReservationsTabStorage,
  VehicleIcon,
  VehicleIconProvider,
} from 'src/app/core/services';
import { MyDateService } from 'src/app/core/services/my-date.service';
import { alreadyStarted } from 'src/app/core/utils/dates/dates';

@Component({
  selector: 'app-my-reservations',
  templateUrl: 'my-reservations.page.html',
  styleUrls: ['my-reservations.page.scss'],
})
export class MyReservationsPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  toolbarTitle = 'Mis Reservas';
  segmentValue = 'calendar';
  viewTitle: string;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    noEventsLabel: 'No tienes reservas',
  };

  private reservationAlreadyStarted = alreadyStarted;
  private getTimeReserved = this.dateSrv.getTimeReserved;
  private reservationsCalendarMode: Reservation[] = [];
  private reservationsListMode: Reservation[] = [];
  private eventSource = [];
  private icons: VehicleIcon[];

  constructor(
    private readonly vehicleIconProvider: VehicleIconProvider,
    private readonly tabStorage: MyReservationsTabStorage,
    private readonly dateSrv: MyDateService,
    private readonly route: ActivatedRoute,
    private readonly ghost: AppRouter
  ) {
    this.icons = this.vehicleIconProvider.getIcons();
  }

  ngOnInit(): void {
    this.refreshComponentData();
  }

  segmentChanged = (e) => (this.segmentValue = e.detail.value);

  onViewTitleChanged(title: string): void {
    this.viewTitle = title;
  }

  getIconSrcFromVehicle(vehicle: Vehicle) {
    const icon = this.icons.filter((i) => i.value === vehicle.icon)[0];
    return icon.src;
  }

  private refreshComponentData(): void {
    this.route.data.subscribe((response) => {
      this.reservationsCalendarMode = response.myReservations;
      this.loadReservations();
    });
  }

  private loadReservations() {
    const events = [];

    // These reservations are all from requester.
    this.reservationsCalendarMode.forEach((reservation) => {
      events.push({
        ...reservation,
        startTime: new Date(reservation.start),
        endTime: new Date(reservation.end),
      });
    });

    this.eventSource = events;
    this.reservationsListMode = this.getListMode(this.reservationsCalendarMode);
  }

  private getListMode(reservations: Reservation[]) {
    const ordered = this.orderReservationsByStart(reservations);
    const result: Reservation[] = [];
    ordered.forEach((reservation) => {
      const isRecurrent = reservation.is_recurrent;
      if (!isRecurrent) {
        result.push(reservation);
      } else {
        // * Si es recurrente
        const index = this.isRecurrentIdInto(result, reservation);

        if (index >= 0) {
          const recurrent = result[index];
          const now = new Date();
          const reservationCompleted = new Date(recurrent.start) < now;
          if (reservationCompleted) {
            // Replace recurrent reservation with newer instance of that same recurrent
            result[index] = reservation;
          }
        } else {
          result.push(reservation);
        }
      }
    });
    return this.orderReservationsByStart(result).reverse();
  }

  private isRecurrentIdInto(reservations: Reservation[], recurrentReservation: Reservation) {
    const recurrentId = recurrentReservation.recurrent.id;
    const index = reservations.findIndex(
      (reservation) => reservation.recurrent?.id === recurrentId
    );
    return index;
  }

  private orderReservationsByStart(reservations: Reservation[]) {
    return reservations.sort((a, b) => (new Date(a.start) < new Date(b.start) ? -1 : 1));
  }

  // Html Helper functions

  private async goToReservation(id: string) {
    await this.ghost.goToReservationDetails(id);
  }

  private differentDay(event): boolean {
    const start = event.startTime;
    const end = event.endTime;

    return start.getUTCDay() !== end.getUTCDay();
  }

  // Ionic2 Calendar

  private next = () => this.myCal.slideNext();

  private back = () => this.myCal.slidePrev();

  private onTimeSelected(event): void {
    const date = new Date(event.selectedTime);
    this.tabStorage.selectDate(date);
  }
}
